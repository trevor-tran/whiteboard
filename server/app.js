const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");

app.use(express.json());

// listening port
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on('connection', (socket) => {
  socket.on('join', roomNumber => {
    roomNumber && socket.join(roomNumber.toString());
  });
  socket.on('transmit', data => {
    // todo: fix broacast to a specific room
    // data.room && socket.to(data.room).emit(data);
    socket.broadcast.emit(data.room, data);
  });

  socket.on("ping", (callback) => {
    callback();
  });
});

server.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
