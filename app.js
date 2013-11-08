
/**
 * Module dependencies.
 */
var bcrypt = require('bcrypt')
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs')
var mongoose = require('mongoose')
var app = express();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
// my modules
var db = require('./db')
var myRoutes = require('./routes/myRoutes')
var awards = require('./awards')

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

/** Passport stuff */
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
            bcrypt.compare(password, user.password, function(error, response){
                if (response === true){
                    return done(null,user)
                }
                else {
                    return done(null, false)
                }
            })
        });
    }
));

app.isAuthenticated = function(request, response, next){
    if(request.isAuthenticated()){
        response.locals.user = request.user
        return next()
    }
    response.redirect("/login")
};
//////////////

app.get('/', app.isAuthenticated, routes.index)

app.get('/login', myRoutes.getLogin)

app.get('/tonetest', app.isAuthenticated, function(request, response){
    response.render('tonetest')
})

app.get('/jqstep', app.isAuthenticated, function(request, response){
    response.render('jqstep')
})

app.get('/logout', function(request, response){
    request.logout()
    response.redirect('/login')
})

app.get('/getuserinfo', app.isAuthenticated, function(request, response){
    response.send(request.user)
})

app.post('/login', passport.authenticate('local'), myRoutes.postLogin);

app.post('/signup', myRoutes.postSignup)

app.post('/tonetestscore', app.isAuthenticated, myRoutes.postTonetestScore)

app.get('/leaderboards/alltime', app.isAuthenticated, myRoutes.getLeaderboardsAlltime)

app.get('/leaderboards/monthly', app.isAuthenticated, myRoutes.getLeaderboardsMonthly)

app.get('/leaderboards/daily', app.isAuthenticated, myRoutes.getLeaderboardsDaily)

app.get('/awards', app.isAuthenticated, myRoutes.getAwards)

/** THIS ROUTE MUST BE LAST */
app.get('/:quote', app.isAuthenticated, myRoutes.getQuote)
//////////////////////////////

/** Start the server */
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
