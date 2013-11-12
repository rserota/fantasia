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
        if (!(user.awards[awardName]) && awards.allAwards[key].check(user) ){
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

exports.postGuestLogin = function(request, response){
    db.User.update({username : 'Guest'}, {$set : {loginDates : [], 'awards' : {'placeholder' : false}}}, function(){}) 
    db.Score.remove({username : 'Guest'}, function(){})
    db.NewsItem.remove({username : 'Guest'}, function(){   
        newNewsItem = new db.NewsItem({
            username : 'Guest',
            type : 'Welcome to Rad Audio!',
            body : "You're signed in with a guest account. You can freely" +
                " check out any part of this site, but your progress will not be" +
                " saved when you log out.  To make the most of your time at" +
                " Rad Audio, you should sign up for an account.  It's quick and easy!"
        }) 
        newNewsItem.save(function(error,results){
            checkAwards(request.user)
            response.send('/')
            
        })
    })
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
                checkAwards(request.user)
                response.send('Score submitted!')
            })
        })
/////////////////

/** Did you top the daily leaderboards? */
    var first = new Date()
    first.setHours(0)
    first.setMinutes(0)
    db.Score.find()
        .where('date').gte(first)
        .sort({'score' : -1})
        .limit(1)
        .exec(function(error, results){
            console.log('results[0]: ', results[0])
            console.log('newScore: ', newScore)
            if ((results[0]) && newScore.score >= results[0].score){
                var newNewsItem = new db.NewsItem({
                    username : request.user.username,
                    type : 'Daily Leader!',
                    body : newsBody.dailyLeader(newScore.score)
                })
                newNewsItem.save()
                awards.allAwards.kingForADay.award(request.user)
            }
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

exports.getAwards = function(request, response){
    var myAwards = []
    console.log('req user awards :', request.user.awards)
    db.User.find({username:request.user.username}, function(error,results){
        console.log('results',results)
        for (key in awards.allAwards){
            console.log(awards.allAwards[key].name)
            if (awards.allAwards[key].name in results[0].awards){
                myAwards.push(awards.allAwards[key])
            }
        }
        console.log('my awards :', myAwards)
        response.render('awards', {myAwards : myAwards})
    })
}

exports.accountSettings = function(request, response){
    response.render('accountsettings')
}

exports.getQuote = function(request, response){
    db.NewsItem.find()
        .where({'username' : request.user.username})
        .sort({'date' : -1})
        .limit(15)
        .exec(function(error, results){
            response.render('index', {newsItems : results})
        })
}

exports.deleteAccount = function(request, response){
    if (request.user.username === 'Guest'){
        response.send('Guest')
    }
    else {
        db.User.remove({username : request.user.username}, function(error){
            response.send('/logout')
        })
    }
}