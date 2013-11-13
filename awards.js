var db = require('./db')
var newsBody = require('./routes/newsBody')

var Award = function(args){
    this.name = args.name
    this.body =  args.body
    this.check = args.check
    this.image = args.image
    this.award = args.award
}

var welcomeToTheParty = new Award({
    name : 'Welcome To The Party',
    body : "You've successfully created an account!  Welcome to Rad Audio.",
    image : './media/images/favicon.ico',
    trigger : 'login',
    check : function(user){
        db.User.find({username : user.username}, function(error,results){
            if(results[0].loginDates.length>0 && !results[0].awards['Welcome To The Party']){
                db.User.update({_id : user._id}, {$set : {'awards.Welcome To The Party' : true}}, function(){})
                var newNewsItem = new db.NewsItem({
                    username : user.username,
                    type : 'New Award!',
                    body : newsBody.earnedAward("Welcome To The Party")
                })
                newNewsItem.save()
            }
        })
    }
})

var doubleDip = new Award({
    name : "Double Dip",
    body : "You've logged in twice in one day!  You must really like it here.",
    image : './media/images/favicon.ico',
    trigger : 'login',

    check : function(user){
        db.User.find({username : user.username}, function(error,results){
            console.log('awards 40: ', results[0])
            var numLogins = results[0].loginDates.length
            if (numLogins > 1){
                var lastLoginDay = results[0].loginDates[numLogins - 1].toLocaleDateString()
                var previousLoginDay = results[0].loginDates[numLogins - 2].toLocaleDateString()
                if(lastLoginDay === previousLoginDay && !results[0].awards['Double Dip']){
                    db.User.update({_id : user._id}, {$set : {'awards.Double Dip' : true}}, function(){})
                    var newNewsItem = new db.NewsItem({
                        username : user.username,
                        type : 'New Award!',
                        body : newsBody.earnedAward("Double Dip")
                    })
                    newNewsItem.save()
                }
            }
        })
    }

    // check : function(user){
    //     if (user.loginDates.length > 1){
    //         var numLogins = user.loginDates.length
    //         var lastLoginDay = user.loginDates[numLogins - 1].toLocaleDateString()
    //         var previousLoginDay = user.loginDates[numLogins - 2].toLocaleDateString()
    //         if (lastLoginDay === previousLoginDay){
    //             return true
    //         }
    //     }
    // }
})

var tryTryAgain = new Award({
    name : "Try, Try Again",
    body : "You can master musical intervals the same way anyone masters anything.",     
    image : './media/images/favicon.ico',
    trigger : 'postscore',
    check : function(user){
        console.log('checking trytry: ')
        db.Score.find({username : user.username}).exec(function(error, results){
            if (results.length > 0){
                console.log('you just earned this one!')
                // user.awards["Try, Try Again"] = true
                db.User.update({_id : user._id}, {$set : {'awards.Try, Try Again' : true}}, function(){})
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
        db.User.find({username:user.username}, function(error, results){
            if (!(results[0].awards['King For A Day'])){
                console.log('you just earned this one!')
                // user.awards['King For A Day'] = true
                db.User.update({_id : user._id}, {$set : {'awards.King For A Day' : true}}, function(){})
                var newNewsItem = new db.NewsItem({
                    username : user.username,
                    type : 'New Award!',
                    body : newsBody.earnedAward('King For A Day')
                })
                newNewsItem.save()
            }
        })
    }
})

var tragedyOfTheCommons = new Award({
    name : "Tragedy Of The Commons",
    body : "Why would you try to delete the Guest account?  Do you just" +
        " enjoy ruining things for other people?",
    image : './media/images/favicon.ico',
    trigger : '',
    check : function(user){},
    award : function(user){
        db.User.find({username : 'Guest'}, function(error, results){
            if (!results[0].awards['Tragedy Of The Commons']){
                db.User.update({username : 'Guest'}, {$set : {'awards.Tragedy Of The Commons' : true}}, function(){})
                var newNewsItem = new db.NewsItem({
                    username : 'Guest',
                    type : 'New Award',
                    body : newsBody.earnedAward('Tragedy Of The Commons')
                })
                newNewsItem.save()
            }
        })
    } 
})

exports.allAwards = {
    welcomeToTheParty : welcomeToTheParty,
    doubleDip : doubleDip,
    tryTryAgain : tryTryAgain,
    kingForADay : kingForADay,
    tragedyOfTheCommons : tragedyOfTheCommons
}
