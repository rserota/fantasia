var db = require('../db')
var bcrypt = require('bcrypt')
var newsBody = require('./newsBody')
var awards = require('../awards')

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

var checkAwards = function(which, request){
    for (var i = 0; i < awards[which].length; i++){
        if (awards[which][i].check(request)){
            for (var j = 0; j < request.user.awards.length; j++){
                console.log('awards[which][i]: ',awards[which][i])
                console.log('request.user.awards[j]: ', request.user.awards[j])
                console.log()
                if (awards[which][i] === request.user.awards[j]){
                    console.log('you already have this one')
                }
                else {
                   db.User.update({_id : request.user._id}, {$addToSet : {awards : awards[which][i]}}, function(){})
                }
            }
        }
    }
}


exports.getLogin  = function(request, response){
    response.status(418)
    response.render('login')
}

exports.postLogin = function(request, response) {
    request.user.loginDates.push(new Date())
    db.User.update({_id : request.user._id}, {$set : {loginDates : request.user.loginDates}}, function(){})
    checkAwards('onLogin', request)   
    response.send('/');
}

exports.postSignup = function(request, response){
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
}

exports.postTonetestScore = function(request, response){
    var newScore = new db.Score({username : request.user.username, score : request.body.score})
    db.Score.find()
        .where({'username' : newScore.username})
        .sort({'score' : -1})
        .limit(1)
        .exec(function(error, results){
            if ((results[0]) && newScore.score > results[0].score){
                newNewsItem = new db.NewsItem({
                    username : request.user.username,
                    type : 'Personal Best!',
                    body : newsBody.personalBest(results[0].score,newScore.score)
                })
                newNewsItem.save()
            }
            newScore.save(function(error, score){
                response.send('Score submitted!')
            })
        })
}

exports.getLeaderboardsAlltime = function(request, response){
    db.Score.find({}, function(error, scores){
        scores.sort(function(a,b){return b.score - a.score})
        scores = onlyTheBest(scores)
        response.render('leaderboards', {history : 'All Time', scores : scores})
    })
}

exports.getLeaderboardsMonthly = function(request, response){
    var first = new Date()
    first.setDate(1)
    first.setHours(0)
    first.setMinutes(0)
    db.Score.find({date : {$gte : first}}, function(error, scores){
        scores.sort(function(a,b){return b.score - a.score})
        scores = onlyTheBest(scores)
        response.render('leaderboards', {history : 'Monthly', scores : scores})
    })
}

exports.getLeaderboardsDaily = function(request, response){
    var first = new Date()
    first.setHours(0)
    first.setMinutes(0)
    db.Score.find({date : {$gte : first}}, function(error, scores){
        scores.sort(function(a,b){return b.score - a.score})
        scores = onlyTheBest(scores)
        response.render('leaderboards', {history : 'Daily', scores : scores})
    })
}

exports.getQuote = function(request, response){
    db.NewsItem.find()
        .where({'username' : request.user.username})
        .sort({'date' : -1})
        .limit(5)
        .exec(function(error, results){
            response.render('index', {newsItems : results})
        })
}