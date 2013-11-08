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

var checkAwards = function(user, trigger){
    for (key in awards.allAwards){
        var awardName = awards.allAwards[key].name
        console.log('award name: ', awardName) 
        if (!(user.awards[awardName]) && awards.allAwards[key].trigger === trigger && awards.allAwards[key].check(user) ){
            console.log('you just earned this one!')
            user.awards[awardName] = true
            db.User.update({_id : user._id}, {$set : {awards : user.awards}}, function(){})
            var newNewsItem = new db.NewsItem({
                username : user.username,
                type : 'New Award!',
                body : newsBody.earnedAward(awardName)
            })
            newNewsItem.save()
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
    checkAwards(request.user)   
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
/** PERSONAL BEST */
    db.Score.find()
        .where({'username' : newScore.username})
        .sort({'score' : -1})
        .limit(1)
        .exec(function(error, results){
            if ((results[0]) && newScore.score > results[0].score){
               var newNewsItem = new db.NewsItem({
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
/////////////////

/** Did you top the daily leaderboards? */
    var first = new Date()
    first.setHours(0)
    first.setMinutes(0)
    db.Score.find()
        .sort({'score' : -1})
        .limit(1)
        .exec(function(error, results){
            if ((results[0]) && newScore.score > results[0].score){
                var newNewsItem = new db.NewsItem({
                    username : request.user.username,
                    type : 'Daily Leader!',
                    body : newsBody.dailyLeader(newScore.score)
                })
                newNewsItem.save()
                awards.allAwards.kingForADay.award(request.user)
            }
        })
    checkAwards(request.user)
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

exports.getAwards = function(request, response){
    var myAwards = []
    for (key in awards.allAwards){
        if (awards.allAwards[key].name in request.user.awards){
            myAwards.push(awards.allAwards[key])
        }
    }
    response.render('awards', {myAwards : myAwards})
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