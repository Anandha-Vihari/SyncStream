const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const rooms = {};

function sanitizeUrl(url) {
  if (!url) return '';
  const httpCount = (url.match(/https?:\/\//g) || []).length;
  if (httpCount > 1) {
    const secondIndex = url.indexOf('http', 1);
    return url.substring(0, secondIndex);
  }
  return url;
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', ({ roomId, username, videoUrl }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.username = username || 'Anonymous';
    
    const cleanUrl = sanitizeUrl(videoUrl);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        url: cleanUrl || '',
        playing: false,
        time: 0,
        fileIndex: 0, // Added to track folder position
        users: 1
      };
    } else {
      rooms[roomId].users += 1;
      if (!rooms[roomId].url && cleanUrl) rooms[roomId].url = cleanUrl;
    }

    socket.emit('room_state', rooms[roomId]);
    
    socket.to(roomId).emit('chat_message', {
      user: 'System',
      text: `${socket.username} joined the room.`,
      time: new Date().toISOString()
    });
  });

  socket.on('video_update', (data) => {
    if (socket.roomId) {
      const roomId = socket.roomId;
      rooms[roomId] = { ...rooms[roomId], ...data };
      
      // Broadcast update to EVERYONE in the room including the sender
      io.to(roomId).emit('video_update', data);

      if (data.url && !rooms[roomId].notified) {
         io.to(roomId).emit('chat_message', {
           user: 'System',
           text: `Video loaded: ${data.url}`,
           time: new Date().toISOString()
         });
         rooms[roomId].notified = true;
      }
    }
  });

  socket.on('chat_message', (message) => {
    if (socket.roomId) {
      io.to(socket.roomId).emit('chat_message', {
        user: socket.username,
        text: message,
        time: new Date().toISOString()
      });
    }
  });

  socket.on('disconnect', () => {
    if (socket.roomId && rooms[socket.roomId]) {
      rooms[socket.roomId].users -= 1;
      io.to(socket.roomId).emit('chat_message', {
        user: 'System',
        text: `${socket.username} left the room.`,
        time: new Date().toISOString()
      });
      if (rooms[socket.roomId].users <= 0) {
        delete rooms[socket.roomId];
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
