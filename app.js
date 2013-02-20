
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , Facebook = require('facebook-node-sdk')
  , mongoose = require('mongoose')

var app = express();

app.configure(function(){
  // mongoose.connect(process.env.MONGOLAB_URI || 'localhost')
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(Facebook.middleware({ appId: '483943034998903', secret: 'df611b3fee8422103d9d24a58f7661d8'}))
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

function facebookGetUser() {
  return function(req, res, next) {
    req.facebook.getUser( function(err, user) {
      if (!user || err){
        res.render("login.jade", {
          title: "Login!"
        });
      } else {
        req.user = user;
        next();
      }
    });
  }
}

app.get('/', Facebook.loginRequired({
  scope: ['user_photos', 'friends_photos', 'publish_stream']
}), user.list)
app.get('/favicon.ico', Facebook.loginRequired({
  scope: ['user_photos', 'friends_photos', 'publish_stream']
}), user.list)
app.get('/login', user.login);
app.get('/photo_render', user.photo_render);
app.get('/logout', facebookGetUser(), user.login_page);

app.post('/photos', user.load_photos);
app.post('/comment', user.comment);
app.post('/color/update', user.update_color);
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});