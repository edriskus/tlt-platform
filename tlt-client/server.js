#!/usr/bin/env node

var express = require('express');
var path = require('path');
var router = express.Router();
var debug = require('debug')('backend:server');
var http = require('http');

/* GET home page. */
router.get('**/*', function(req, res, next) {
  res.sendFile(path.join(__dirname, './dist/tlt-ng/index.html'));
});

var app = express();
app.use(express.static(path.join(__dirname, './dist/tlt-ng/')));
app.use('/', router);

var port = normalizePort(process.env.PORT || '4200');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
