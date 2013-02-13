
/**
 * Module dependencies.
 */

require('coffee-script');
var express = require('express');

require('express-namespace');

var app = module.exports = express()
  , io = require('socket.io')
  , path = require('path')
  , RedisStore = require('connect-redis')(express)
  , flash = require('connect-flash');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: "I am totes secure",
    store: new RedisStore
  }));
  app.use(require('connect-assets')());
  app.use(flash());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.configure('test', function(){
  app.set('port', 3001);
});

// Global helpers
require('./apps/helpers')(app);

require('./middleware/upgrade')(app);

require('./apps/authentication/routes')(app);
require('./apps/admin/routes')(app);
require('./apps/sidewalk/routes')(app);

server = app.listen(app.settings.port);
console.log("Express server listening on port %d in %s mode", app.settings.port, app.settings.env);

// Socket IO
socketIO = io.listen(server);

if(!app.settings.socketIO) {
  app.set('socketIO', socketIO)
}

socketIO.sockets.on('connection', function(socket){
  console.log('CONNECTED')
});

