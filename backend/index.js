const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for the prototype
    methods: ["GET", "POST"]
  }
});

// In-memory store for rooms
// rooms[roomId] = { url: string, playing: boolean, time: number, users: number }
const rooms = {};

function sanitizeUrl(url) {
  if (!url) return '';
  // Check if URL is doubled (e.g. http://...http://...)
  const httpCount = (url.match(/https?:\/\//g) || []).length;
  if (httpCount > 1) {
    const secondIndex = url.indexOf('http', 1);
    if (secondIndex !== -1) {
      console.log(`Sanitizing doubled URL: ${url} -> ${url.substring(0, secondIndex)}`);
      return url.substring(0, secondIndex);
    }
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
    console.log(`Join attempt: ${username} -> Room ${roomId} (Original URL: ${videoUrl}, Clean URL: ${cleanUrl})`);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        url: cleanUrl || '',
        playing: false,
        time: 0,
        users: 1
      };
      console.log(`Room ${roomId} created with URL: ${rooms[roomId].url}`);
    } else {
      rooms[roomId].users += 1;
      // If the joining user provides a URL and the room has none, update it
      if (!rooms[roomId].url && cleanUrl) {
        rooms[roomId].url = cleanUrl;
      }
      console.log(`Room ${roomId} already exists. Current URL: ${rooms[roomId].url}`);
    }

    // Send the current room state to the newly joined user
    socket.emit('room_state', rooms[roomId]);
    
    // Notify others
    socket.to(roomId).emit('chat_message', {
      user: 'System',
      text: `${socket.username} joined the room.`,
      time: new Date().toISOString()
    });
    
    console.log(`${socket.username} joined room: ${roomId}`);
  });

  socket.on('video_update', (data) => {
    // data: { url, playing, time }
    if (socket.roomId) {
      const roomId = socket.roomId;
      
      // Update server state
      rooms[roomId] = { ...rooms[roomId], ...data };
      
      // Broadcast to everyone else in the room
      socket.to(roomId).emit('video_update', data);

      // System notification for sync events (optional but good for debug)
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
    console.log('User disconnected:', socket.id);
    if (socket.roomId && rooms[socket.roomId]) {
      rooms[socket.roomId].users -= 1;
      
      io.to(socket.roomId).emit('chat_message', {
        user: 'System',
        text: `${socket.username} left the room.`,
        time: new Date().toISOString()
      });

      if (rooms[socket.roomId].users <= 0) {
        // Clean up empty rooms
        delete rooms[socket.roomId];
        console.log(`Room ${socket.roomId} deleted (empty).`);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
