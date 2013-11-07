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
    check : function(request){
        if (request.user.loginDates.length > 0){
            return true
        }
    }
})

var doubleDip = new Award({
    name : "Double Dip",
    body : "You've logged in twice in one day!  You must really like it here.",
    image : './media/images/favicon.ico',
    check : function(request){
        if (request.user.loginDates.length > 1){
            var numLogins = request.user.loginDates.length
            var lastLoginDay = request.user.loginDates[numLogins - 1].toLocaleDateString()
            var previousLoginDay = request.user.loginDates[numLogins - 2].toLocaleDateString()
            if (lastLoginDay === previousLoginDay){
                return true
            }
        }
    }
})

var tryTryAgain = new Award({
    name : "Try, Try again",
    body : "You can master musical intervals the same way anyone masters anything.",     
    image : './media/images/favicon.ico',
    // check : function
}) 

exports.allAwards = [welcomeToTheParty, doubleDip]
exports.on