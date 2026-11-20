
const rooms = new Map();
let matchmakingQueue = [];
const MATCH_DURATION_SECONDS = 60;

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rooms.has(code) ? generateRoomCode() : code;
}
function triggerInterviewPhase(io, roomCode, reason) {
  const room = rooms.get(roomCode);
  if (!room || room.status === 'INTERVIEW') return; 

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
    submissions: room.submissions
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
  if (!room || room.players.length < 2) return;

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
    players: room.players,
    problem: sampleProblem
  });
  console.log(`Battle started in room ${roomCode}: ${room.players[0].username} vs ${room.players[1].username}`);
  startMatchTimer(io, roomCode);
}
function initSocket(io) {
  io.on('connection', (socket) => {
    console.log(`Connected: ${socket.id}`);
    socket.on('room:create', ({ username }) => {
      const roomCode = generateRoomCode();
      const player = { socketId: socket.id, username: username || 'Player 1' };
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
      socket.emit('room:created', { roomCode, player });
      console.log(`🏠 Room ${roomCode} created by ${player.username}`);
    });

    // 2. JOIN PRIVATE ROOM WITH CODE
    socket.on('room:join', ({ roomCode, username }) => {
      const code = (roomCode || '').trim().toUpperCase();
      const room = rooms.get(code);

      if (!room) return socket.emit('room:error', { message: 'Room not found.' });
      if (room.players.length >= 2) return socket.emit('room:error', { message: 'Room is full.' });
      if (room.players.some((p) => p.socketId === socket.id)) {
        return socket.emit('room:error', { message: 'You are already in this room.' });
      }

      const player = { socketId: socket.id, username: username || 'Player 2' };
      room.players.push(player);
      socket.join(code);

      console.log(`${player.username} joined room ${code}`);
      startBattle(io, code);
    });
    socket.on('matchmaking:join', ({ username }) => {
      if (matchmakingQueue.some((p) => p.socketId === socket.id)) return;
      const player = { socketId: socket.id, username: username || 'Coder' };
      matchmakingQueue.push(player);
      socket.emit('matchmaking:waiting', { message: 'Searching for an opponent...' });
      if (matchmakingQueue.length >= 2) {
        const p1 = matchmakingQueue.shift();
        const p2 = matchmakingQueue.shift();
        const roomCode = generateRoomCode();
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
    socket.on('submission:finalized', ({ roomCode, code, language }) => {
      const room = rooms.get(roomCode);
      if (!room || room.status !== 'CODING') return;
      if (room.submissions[socket.id]) return;
      const submittingPlayer = room.players.find((p) => p.socketId === socket.id);
      if (!submittingPlayer) return;
      room.submissions[socket.id] = {
        username: submittingPlayer.username,
        code: code || '// sample solution',
        language: language || 'java',
        submittedAt: Date.now()
      };
      console.log(`${submittingPlayer.username} submitted code in room ${roomCode}`);
      socket.emit('submission:confirmed', { message: 'Code submitted! Waiting for opponent...' });
      socket.to(roomCode).emit('opponent:submitted', {
        username: submittingPlayer.username,
        message: `${submittingPlayer.username} has finalized their submission!`
      });
      const submittedCount = Object.keys(room.submissions).length;
      if (submittedCount >= 2) {
        triggerInterviewPhase(io, roomCode, 'BOTH_SUBMITTED');
      }
    });
    socket.on('disconnect', () => {
      matchmakingQueue = matchmakingQueue.filter((p) => p.socketId !== socket.id);
      console.log(`Disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSocket;