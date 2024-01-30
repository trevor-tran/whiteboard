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
    origin: "http://localhost:3000, https://trevortran.com/canvas"
  }
});

io.on('connection', (socket) => {
  socket.on("room", roomNumber => {
    roomNumber && socket.join(roomNumber);
  });

  socket.on('transmit', conn => {
    // todo: use room instead to limit
    // # of sockets received msg
    // io.to(conn.room).emit(conn.shapes);
    console.log(conn)
    socket.broadcast.emit(conn.room, conn.shapes);
  });

  socket.on("ping", (callback) => {
    callback();
  });
});

server.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
