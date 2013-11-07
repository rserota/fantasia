var mongoose = require('mongoose')
var db_url = global.process.env.MONGOHQ_URL || 'mongodb://localhost/fantasia'
mongoose.connect(db_url)

var letsMakeADate = function(){
    return new Date()
}

var User = mongoose.model('User', {
    username : {type : String, match : /.../, required : true, unique : true},
    password : {type : String, required : true},
    loginDates : {type : [Date], default : []},
    awards : {type : Array, default : []}
})

var Score = mongoose.model('Score', {
    username : {type : String},
    score : {type : Number},
    date : {type : Date, default : letsMakeADate}
})

var NewsItem = mongoose.model('NewsItem', {
    username : {type : String},
    type : {type : String},
    body : {type : String},
    date : {type : Date, default : letsMakeADate}
})

exports.User = User 
exports.Score = Score
exports.NewsItem = NewsItem