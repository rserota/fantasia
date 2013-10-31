
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs')
var mongoose = require('mongoose')
var app = express();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
// my modules
var db = require('./db')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'cat keyboard'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



///

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (password !== user.password) { return done(null, false); }
      return done(null, user);
    });
  }
));

app.isAuthenticated = function(request, response, next){
    if(request.isAuthenticated()){
        return next()
    }
    response.redirect("/login")
};


///

app.get('/', app.isAuthenticated, routes.index)

app.get('/login', function(request, response){
    response.status(418)
    response.render('login')
})

app.get('/tonetest', app.isAuthenticated, function(request, response){
    response.render('tonetest')
})

app.get('/jqstep', app.isAuthenticated, function(request, response){
    response.render('jqstep')
})

app.get('/:quote', app.isAuthenticated, function(request, response){
    response.render('index', {time : new Date()})
})

app.post('/login', passport.authenticate('local'), function(request, response) {
    request.user.loginDates.push(new Date())
<<<<<<< HEAD
    db.User.update({_id : request.user._id}, {$set : {loginDates : request.user.loginDates}}, function(){
      console.log('Saved the login date!')
    })
=======
    db.User.update({_id : request.user._id}, {$set : {loginDates : request.user.loginDates}}, function(){})
>>>>>>> e318bd08d4fedb4c8308a32776b2adbccb917131
    response.send('/');
});

app.post('/signup', function(request, response){
<<<<<<< HEAD
    return
})

=======
    var newGuy = new db.User({username : request.body.username, password : request.body.password})
    newGuy.save(function(error, User){
        if(error){response.send(error)}
        else {response.send('success')}
    })
 })

app.get('/logout', function(request, response){
    request.logout()
    response.redirect('/login')
})

app.get('/getuserinfo', app.isAuthenticated, function(request, response){
    response.send(request.user)
})

// app.post('/tonetestscore', )



/** THIS ROUTE MUST BE LAST */
app.get('/:quote', app.isAuthenticated, function(request, response){
    response.render('index', {time : new Date()})
})
//////////////////////////////

>>>>>>> e318bd08d4fedb4c8308a32776b2adbccb917131
/** Start the server */
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
