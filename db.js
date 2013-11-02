var mongoose = require('mongoose')
db_url = process.env.MONGOHQ_URL || 'mongodb://localhost/fantasia'
mongoose.connect('mongodb://heroku:ae78ae5aae91fb3c55881e4ec0122cc4@paulo.mongohq.com:10043/app19103424')



var User = mongoose.model('User',{
    username : {type : String, match : /.../, required : true, unique : true},
    password : {type : String, match : /...../, required : true},
    loginDates : {type : Array, default : []},
    badges : {type : Array, default : []}
})

var Score = mongoose.model('Score', {
    username : {type : String},
    score : {type : Number},
    date : {type : Date, default : new Date()}
})

exports.User = User 
exports.Score = Score