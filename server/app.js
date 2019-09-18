const express = require('express');
const app = express();
const socket = require('socket.io');
const http = require('http');

app.use(express.json());

// listening port
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = socket(server);

//Whenever someone connects this gets executed
io.on('connection', (socket) => {
  // console.log('A user connected')
  socket.on("broadcast", data => {
    // console.log(data)
    socket.broadcast.emit(data.state.room, data)
  })
});


server.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}`);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
