const express = require('express');
const app = express();
const socket = require('socket.io');
const http = require('http');

app.use(express.json());

// listening port
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

server.listen(PORT, ()=>{
  console.log(`Listening on port ${PORT}`);
});

app.get('/test', (req, res) => {
  res.json({
    message: err.message,
    error: err
  })
})

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
