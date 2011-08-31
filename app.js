
/**
 * Module dependencies.
 */

var express = require('express'),
    redis = require('redis'),
    processor = require('./processor');

var app = module.exports = express.createServer();

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

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);