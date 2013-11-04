var mongoose = require('mongoose')
var db_url = global.process.env.MONGOHQ_URL || 'mongodb://localhost/fantasia'
mongoose.connect(db_url)



var User = mongoose.model('User',{
    username : {type : String, match : /.../, required : true, unique : true},
    password : {type : String, required : true},
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