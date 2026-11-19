
const rooms = new Map();
let matchmakingQueue = [];
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rooms.has(code) ? generateRoomCode() : code;
}
function startBattle(io, roomCode) {
  const room = rooms.get(roomCode);
  if (!room || room.players.length < 2) return;
  room.status = 'CODING';
  room.startedAt = Date.now();
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
    players: room.players,
    problem: sampleProblem
  });

  console.log(`Battle started in room ${roomCode}: ${room.players[0].username} vs ${room.players[1].username}`);
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
        problem: null
      });

      socket.join(roomCode);
      socket.emit('room:created', { roomCode, player });
      console.log(`Room ${roomCode} created by ${player.username}`);
    });
    socket.on('room:join', ({ roomCode, username }) => {
      const code = (roomCode || '').trim().toUpperCase();
      const room = rooms.get(code);

      if (!room) {
        return socket.emit('room:error', { message: 'Room not found. Check the code.' });
      }
      if (room.players.length >= 2) {
        return socket.emit('room:error', { message: 'Room is already full.' });
      }
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
      // Prevent duplicate queue entries from the same socket
      if (matchmakingQueue.some((p) => p.socketId === socket.id)) return;

      const player = { socketId: socket.id, username: username || 'Coder' };
      matchmakingQueue.push(player);
      socket.emit('matchmaking:waiting', { message: 'Searching for an opponent...' });
      console.log(`${player.username} joined matchmaking queue (${matchmakingQueue.length} waiting)`);
      if (matchmakingQueue.length >= 2) {
        const p1 = matchmakingQueue.shift();
        const p2 = matchmakingQueue.shift();
        const roomCode = generateRoomCode();
        rooms.set(roomCode, {
          roomCode,
          status: 'WAITING',
          players: [p1, p2],
          problem: null
        });

        const s1 = io.sockets.sockets.get(p1.socketId);
        const s2 = io.sockets.sockets.get(p2.socketId);
        if (s1) s1.join(roomCode);
        if (s2) s2.join(roomCode);

        startBattle(io, roomCode);
      }
    });
    socket.on('disconnect', () => {
      matchmakingQueue = matchmakingQueue.filter((p) => p.socketId !== socket.id);
      console.log(`Disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSocket;