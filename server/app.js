var createError = require('http-errors');
const express = require('express');
const app = express();
const socket = require('socket.io');
const http = require('http');
var path = require('path');

app.use(express.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// listening port
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

// having time out to fix "WebSocket is already in CLOSING or CLOSED state"
const io = socket(server, {pingTimeout: 60000});

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


// display a test
app.get('/', (req, res) => {
  res.render('root')
})
app.get('/test/', (req, res) => {
  res.render('test')
})

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204);
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
