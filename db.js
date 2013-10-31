var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/fantasia')



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