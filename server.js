var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var blog = require('./routes/blog');
var engine = require("ejs-locals");

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

var app = express();
app.engine("ejs",engine);

// all environments
app.set('port', port);
app.set('ipaddress',ipaddress);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/blogs/new',blog.new);
app.post('/blogs/new',blog.save);
app.get('/blogs', blog.list);

http.createServer(app).listen(app.get('port'),app.get('ipaddress') ,  function(){
  console.log('Express server listening on '+app.get('ipaddress')+ ':'+ app.get('port'));
});