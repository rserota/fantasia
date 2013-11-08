var db = require('./db')
var newsBody = require('./routes/newsBody')

var Award = function(args){
    this.name = args.name
    this.body =  args.body
    this.check = args.check
    this.image = args.image
}

var welcomeToTheParty = new Award({
    name : 'Welcome To The Party',
    body : "You've successfully created an account!  Welcome to Rad Audio.",
    image : './media/images/favicon.ico',
    trigger : 'login',
    check : function(user){
        if (user.loginDates.length > 0){
            return true
        }
    }
})

var doubleDip = new Award({
    name : "Double Dip",
    body : "You've logged in twice in one day!  You must really like it here.",
    image : './media/images/favicon.ico',
    trigger : 'login',
    check : function(user){
        if (user.loginDates.length > 1){
            var numLogins = user.loginDates.length
            var lastLoginDay = user.loginDates[numLogins - 1].toLocaleDateString()
            var previousLoginDay = user.loginDates[numLogins - 2].toLocaleDateString()
            if (lastLoginDay === previousLoginDay){
                return true
            }
        }
    }
})

var tryTryAgain = new Award({
    name : "Try, Try Again",
    body : "You can master musical intervals the same way anyone masters anything.",     
    image : './media/images/favicon.ico',
    trigger : 'postscore',
    check : function(user){
        db.Score.find({username : user.username}).exec(function(error, results){
            if (results.length > 0){
                console.log('you just earned this one!')
                user.awards["Try, Try Again"] = true
                db.User.update({_id : user._id}, {$set : {awards : user.awards}}, function(){})
                var newNewsItem = new db.NewsItem({
                    username : user.username,
                    type : 'New Award!',
                    body : newsBody.earnedAward("Try, Try Again")
                })
                newNewsItem.save()
            }
        })
    }
}) 

var kingForADay = new Award({
    name : "King For A Day",
    body : "Congratulations on getting to the top of the daily leaderboards, " +
        "but don't get too comfortable.  The daily leaderboards reset at midnight",
    image : './media/images/favicon.ico',
    trigger : 'postscore',
    check : function(user){},
    award : function(user){
        if (!(user.awards['King For A Day'])){
            console.log('you just earned this one!')
            user.awards['King For A Day'] = true
            db.User.update({_id : user._id}, {$set : {awards : user.awards}}, function(){})
            var newNewsItem = new db.NewsItem({
                username : user.username,
                type : 'New Award!',
                body : newsBody.earnedAward('King For A Day')
            })
            newNewsItem.save()
        }
    }
})

exports.allAwards = {
    welcomeToTheParty : welcomeToTheParty,
    doubleDip : doubleDip,
    tryTryAgain : tryTryAgain,
    kingForADay : kingForADay
}
