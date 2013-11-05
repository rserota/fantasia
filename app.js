
/**
 * Module dependencies.
 */
var bcrypt = require('bcrypt')
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

var onlyTheBest = function(scores){
    var accountedFor = {}
    var newScores = []
    for (var i = 0; i < scores.length; i++){
        if (!accountedFor[scores[i].username]){
            newScores.push(scores[i])
            accountedFor[scores[i].username] = true
        }
    }
    return newScores
}

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


app.get('/logout', function(request, response){
    request.logout()
    response.redirect('/login')
})

app.get('/getuserinfo', app.isAuthenticated, function(request, response){
    response.send(request.user)
})

app.post('/login', passport.authenticate('local'), function(request, response) {
    request.user.loginDates.push(new Date())
    db.User.update({_id : request.user._id}, {$set : {loginDates : request.user.loginDates}}, function(){})
    response.send('/');
});

app.post('/signup', function(request, response){
    if (request.body.password.length < 5){
        response.send({errors : {password : true}})
    }
    else {
        bcrypt.genSalt(10, function(error, salt){
            bcrypt.hash(request.body.password, salt, function(error, hash){
                var newGuy = new db.User({username : request.body.username, password : hash})
                newGuy.save(function(error, User){
                    if(error){response.send(error)}
                    else {response.send('success')}
                })
            })
        })
    }
})

app.post('/tonetestscore', function(request, response){
    newScore = new db.Score({username : request.user.username, score : request.body.score})
    newScore.save(function(error, score){
        response.send('Score submitted!')
    })
})

app.get('/leaderboards/alltime', app.isAuthenticated, function(request, response){
    db.Score.find({}, function(error, scores){
        scores.sort(function(a,b){return b.score - a.score})
        scores = onlyTheBest(scores)
        response.render('leaderboards', {history : 'All Time', scores : scores})
    })
})

app.get('/leaderboards/monthly', app.isAuthenticated, function(request, response){
    var first = new Date()
    first.setDate(1)
    first.setHours(0)
    first.setMinutes(0)
    db.Score.find({date : {$gte : first}}, function(error, scores){
        scores.sort(function(a,b){return b.score - a.score})
        scores = onlyTheBest(scores)
        response.render('leaderboards', {history : 'Monthly', scores : scores})
    })
})

app.get('/leaderboards/daily', app.isAuthenticated, function(request, response){
    var first = new Date()
    first.setHours(0)
    first.setMinutes(0)
    db.Score.find({date : {$gte : first}}, function(error, scores){
        scores.sort(function(a,b){return b.score - a.score})
        scores = onlyTheBest(scores)
        response.render('leaderboards', {history : 'Daily', scores : scores})
    })
})

/** THIS ROUTE MUST BE LAST */
app.get('/:quote', app.isAuthenticated, function(request, response){
    response.render('index', {time : new Date()})
})
//////////////////////////////

/** Start the server */
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
