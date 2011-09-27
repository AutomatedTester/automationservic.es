
/**
 * Module dependencies.
 */

var express = require('express'),
    redis = require('redis'),
    socketio = require('socket.io'),
    processor = require('./processor');

var app = module.exports = express.createServer();
var io = socketio.listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Automation Services'
  });
});

app.get('/team', function(req, res){
  res.render('team', {
    title: 'Automation Services'
  });
});

app.get('/irc', function(req, res){
  client = redis.createClient();
  client.lrange('automation', -30, -1, function(err, d){
    lrang = processor.process(d);       
        
     // Let's render!
    res.render('irc', {
      title: 'Automation Services',
      irc : lrang,
    });
  });
  client.quit()
});

app.get('/manifest.json', function(req, res){
  MANIFEST =   {
    "version": "0.1",
    "name": "AutomationServices",
    "description": "AutomationServices is a team that tries to solve really big problems!",
    "icons": {  
      "16": "/images/robot-16.png",  
      "48": "/images/robot-48.png",  
      "128": "/images/robot-128.png"  
    }, 
    "developer": {
      "name": "David Burns",
      "url": "http://www.automationservic.es"
    },
    "default_locale": "en"
  }

  res.json(MANIFEST, { 'Content-Type': 'application/x-web-app-manifest+json' });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

io.sockets.on('connection', function (socket) {
  client= redis.createClient();
  client.on("pmessage", function (pattern, channel, message) {
    socket.emit('message', { message: processor.process([message]) });
  });
  client.psubscribe("automation");
});
