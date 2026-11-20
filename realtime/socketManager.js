
const rooms = new Map();
let matchmakingQueue = [];
const MATCH_DURATION_SECONDS = 900; 
const RECONNECT_GRACE_SECONDS = 30;
const INITIAL_SCORE = 100;
const TAB_SWITCH_PENALTY = 5;
const MAX_TAB_SWITCHES = 3;
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rooms.has(code) ? generateRoomCode() : code;
}
function cleanupRoom(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;
  if (room.timerInterval) clearInterval(room.timerInterval);
  room.players.forEach((p) => {
    if (p.disconnectTimeout) clearTimeout(p.disconnectTimeout);
  });
  rooms.delete(roomCode);
  console.log(`Room ${roomCode} cleaned up from memory`);
}
function triggerInterviewPhase(io, roomCode, reason) {
  const room = rooms.get(roomCode);
  if (!room || room.status === 'INTERVIEW' || room.status === 'ENDED') return;
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;
  }
  room.status = 'INTERVIEW';
  console.log(`Triggering AI Interview for room ${roomCode} (Reason: ${reason})`);
  io.to(roomCode).emit('phase:interview', {
    roomCode,
    status: 'INTERVIEW',
    reason,
    submissions: room.submissions,
    scores: room.players.map(({ username, score, tabSwitches }) => ({
      username,
      score,
      tabSwitches
    }))
  });
}
function startMatchTimer(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;
  room.timeLeft = MATCH_DURATION_SECONDS;
  room.timerInterval = setInterval(() => {
    room.timeLeft -= 1;
    io.to(roomCode).emit('timer:tick', {
      roomCode,
      timeLeft: room.timeLeft
    });
    if (room.timeLeft <= 0) {
      io.to(roomCode).emit('match:time_up', { roomCode });
      triggerInterviewPhase(io, roomCode, 'TIME_UP');
    }
  }, 1000);
}
function startBattle(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room || room.players.length < 2 || room.status !== 'WAITING') return;
  room.status = 'CODING';
  room.submissions = {}; 
  const sampleProblem = {
    id: 'prob-101',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'
  };
  room.problem = sampleProblem;
  io.to(roomCode).emit('match:start', {
    roomCode,
    status: room.status,
    duration: MATCH_DURATION_SECONDS,
    players: room.players.map(({ socketId, username, connected, score, tabSwitches }) => ({
      socketId,
      username,
      connected,
      score,
      tabSwitches
    })),
    problem: sampleProblem
  });
  console.log(`Battle started in room ${roomCode}: ${room.players[0].username} vs ${room.players[1].username}`);
  startMatchTimer(io, roomCode);
}
function initSocket(io) {
  io.on('connection', (socket) => {
    console.log(` Connected: ${socket.id}`);
    socket.on('room:create', ({ username }) => {
      const cleanName = (username || 'Player 1').trim();
      const roomCode = generateRoomCode();
      const player = {
        socketId: socket.id,
        username: cleanName,
        connected: true,
        score: INITIAL_SCORE,
        tabSwitches: 0,
        disconnectTimeout: null
      };
      rooms.set(roomCode, {
        roomCode,
        status: 'WAITING',
        players: [player],
        problem: null,
        submissions: {},
        timeLeft: MATCH_DURATION_SECONDS,
        timerInterval: null
      });
      socket.join(roomCode);
      socket.emit('room:created', {
        roomCode,
        player: { socketId: player.socketId, username: player.username, score: player.score }
      });
      console.log(`Room ${roomCode} created by ${cleanName}`);
    });
    socket.on('room:join', ({ roomCode, username }) => {
      const code = (roomCode || '').trim().toUpperCase();
      const cleanName = (username || 'Player 2').trim();
      const room = rooms.get(code);

      if (!room) return socket.emit('room:error', { message: 'Room not found.' });
      if (room.status !== 'WAITING') return socket.emit('room:error', { message: 'Match already in progress. Use Rejoin if disconnected.' });
      if (room.players.length >= 2) return socket.emit('room:error', { message: 'Room is full.' });
      if (room.players.some((p) => p.socketId === socket.id || p.username === cleanName)) {
        return socket.emit('room:error', { message: 'Duplicate player or username already in room.' });
      }

      const player = {
        socketId: socket.id,
        username: cleanName,
        connected: true,
        score: INITIAL_SCORE,
        tabSwitches: 0,
        disconnectTimeout: null
      };
      room.players.push(player);
      socket.join(code);
      console.log(`👥${cleanName} joined room ${code}`);
      startBattle(io, code);
    });
    socket.on('matchmaking:join', ({ username }) => {
      const cleanName = (username || 'Coder').trim();
      if (matchmakingQueue.some((p) => p.socketId === socket.id)) return;
      matchmakingQueue.push({ socketId: socket.id, username: cleanName });
      socket.emit('matchmaking:waiting', { message: 'Searching for an opponent...' });
      if (matchmakingQueue.length >= 2) {
        const p1Data = matchmakingQueue.shift();
        const p2Data = matchmakingQueue.shift();
        const roomCode = generateRoomCode();
        const p1 = { ...p1Data, connected: true, score: INITIAL_SCORE, tabSwitches: 0, disconnectTimeout: null };
        const p2 = { ...p2Data, connected: true, score: INITIAL_SCORE, tabSwitches: 0, disconnectTimeout: null };
        rooms.set(roomCode, {
          roomCode,
          status: 'WAITING',
          players: [p1, p2],
          problem: null,
          submissions: {},
          timeLeft: MATCH_DURATION_SECONDS,
          timerInterval: null
        });
        const s1 = io.sockets.sockets.get(p1.socketId);
        const s2 = io.sockets.sockets.get(p2.socketId);
        if (s1) s1.join(roomCode);
        if (s2) s2.join(roomCode);
        startBattle(io, roomCode);
      }
    });
    socket.on('cheat:tab_switch', ({ roomCode }) => {
      const code = (roomCode || '').trim().toUpperCase();
      const room = rooms.get(code);
      if (!room || room.status !== 'CODING') return;
      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player) return;
      player.tabSwitches += 1;
      if (player.tabSwitches >= MAX_TAB_SWITCHES) {
        player.score = 0;
        room.status = 'ENDED';
        const winner = room.players.find((p) => p.username !== player.username);
        console.log(`${player.username} DISQUALIFIED in room ${code} after ${MAX_TAB_SWITCHES} tab switches`);
        io.to(code).emit('match:disqualified', {
          roomCode: code,
          disqualifiedPlayer: player.username,
          winner: winner ? winner.username : 'Opponent',
          tabSwitches: player.tabSwitches,
          reason: 'MAX_TAB_SWITCHES_EXCEEDED',
          message: `${player.username} was disqualified for switching tabs ${MAX_TAB_SWITCHES} times! ${winner?.username} wins!`
        });
        cleanupRoom(code);
        return;
      }
      player.score = Math.max(0, player.score - TAB_SWITCH_PENALTY);
      const strikesLeft = MAX_TAB_SWITCHES - player.tabSwitches;
      console.log(`Tab switch (${player.tabSwitches}/${MAX_TAB_SWITCHES}) by ${player.username} in room ${code} (New Score: ${player.score})`);
      socket.emit('cheat:warning', {
        type: 'TAB_SWITCH',
        penalty: TAB_SWITCH_PENALTY,
        tabSwitches: player.tabSwitches,
        maxSwitches: MAX_TAB_SWITCHES,
        newScore: player.score,
        message: `Warning (${player.tabSwitches}/${MAX_TAB_SWITCHES}): Tab switching is prohibited! -${TAB_SWITCH_PENALTY} pts deducted. ${strikesLeft} warning(s) left before disqualification.`
      });
      socket.to(code).emit('opponent:tab_switched', {
        username: player.username,
        penalty: TAB_SWITCH_PENALTY,
        tabSwitches: player.tabSwitches,
        maxSwitches: MAX_TAB_SWITCHES,
        opponentScore: player.score,
        message: `${player.username} switched tabs (${player.tabSwitches}/${MAX_TAB_SWITCHES})! (-${TAB_SWITCH_PENALTY} pts)`
      });
    });
    socket.on('room:rejoin', ({ roomCode, username }) => {
      const code = (roomCode || '').trim().toUpperCase();
      const cleanName = (username || '').trim();
      const room = rooms.get(code);
      if (!room || room.status === 'ENDED') {
        return socket.emit('room:error', { message: 'Match no longer active or already ended.' });
      }
      const player = room.players.find((p) => p.username === cleanName);
      if (!player) {
        return socket.emit('room:error', { message: 'Player record not found in this room.' });
      }
      if (player.disconnectTimeout) {
        clearTimeout(player.disconnectTimeout);
        player.disconnectTimeout = null;
      }
      player.socketId = socket.id;
      player.connected = true;
      socket.join(code);
      console.log(`${cleanName} reconnected to room ${code}`);
      socket.emit('room:rejoined', {
        roomCode: code,
        status: room.status,
        timeLeft: room.timeLeft,
        problem: room.problem,
        players: room.players.map(({ socketId, username, connected, score, tabSwitches }) => ({
          socketId,
          username,
          connected,
          score,
          tabSwitches
        })),
        hasSubmitted: Boolean(room.submissions[cleanName])
      });
      socket.to(code).emit('opponent:reconnected', {
        username: cleanName,
        message: `${cleanName} reconnected to the battle!`
      });
    });
    socket.on('submission:finalized', ({ roomCode, code, language }) => {
      const room = rooms.get(roomCode);
      if (!room || room.status !== 'CODING') return;
      const submittingPlayer = room.players.find((p) => p.socketId === socket.id);
      if (!submittingPlayer) return;
      if (room.submissions[submittingPlayer.username]) {
        return socket.emit('room:error', { message: 'You have already submitted your solution.' });
      }
      room.submissions[submittingPlayer.username] = {
        username: submittingPlayer.username,
        code: code || '// sample solution',
        language: language || 'java',
        finalScore: submittingPlayer.score,
        tabSwitches: submittingPlayer.tabSwitches,
        submittedAt: Date.now()
      };
      console.log(`${submittingPlayer.username} submitted code in room ${roomCode}`);
      socket.emit('submission:confirmed', { message: 'Code submitted! Waiting for opponent...' });
      socket.to(roomCode).emit('opponent:submitted', {
        username: submittingPlayer.username,
        message: `${submittingPlayer.username} has finalized their submission!`
      });
      if (Object.keys(room.submissions).length >= 2) {
        triggerInterviewPhase(io, roomCode, 'BOTH_SUBMITTED');
      }
    });
    socket.on('disconnect', () => {
      matchmakingQueue = matchmakingQueue.filter((p) => p.socketId !== socket.id);
      for (const [roomCode, room] of rooms.entries()) {
        const player = room.players.find((p) => p.socketId === socket.id);
        if (!player) continue;
        player.connected = false;
        console.log(`${player.username} disconnected from room ${roomCode}`);

        if (room.status === 'WAITING') {
          cleanupRoom(roomCode);
          return;
        }
        if (room.players.every((p) => !p.connected)) {
          cleanupRoom(roomCode);
          return;
        }
        io.to(roomCode).emit('opponent:disconnected', {
          username: player.username,
          graceSeconds: RECONNECT_GRACE_SECONDS,
          message: `${player.username} disconnected. Waiting ${RECONNECT_GRACE_SECONDS}s for reconnection...`
        });
        player.disconnectTimeout = setTimeout(() => {
          const activeRoom = rooms.get(roomCode);
          if (!activeRoom || activeRoom.status === 'ENDED') return;
          activeRoom.status = 'ENDED';
          const winner = activeRoom.players.find((p) => p.username !== player.username);
          console.log(`${winner?.username} won room ${roomCode} by opponent forfeit`);
          io.to(roomCode).emit('match:forfeit', {
            roomCode,
            winner: winner ? winner.username : 'Opponent',
            message: `${player.username} failed to reconnect. ${winner?.username} wins by forfeit!`
          });
          cleanupRoom(roomCode);
        }, RECONNECT_GRACE_SECONDS * 1000);
        break;
      }
    });
  });
}

module.exports = initSocket;