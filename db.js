var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/fantasia')



var User = mongoose.model('User',{
    username : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    loginDates : {type : Array, default : []},
    badges : {type : Array, default : []}
})

exports.User = User 