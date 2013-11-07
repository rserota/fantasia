
var personalBest = function(oldScore, newScore){
    var beaten = ['crushed', 'destroyed', 'obliterated', 'demolished', 'stomped', 'beat']
    var choice = beaten[Math.floor(Math.random() * beaten.length)]
    var body = "Wow, congratulations!  You totally " + choice + " your previous high score" + 
        " of " + oldScore + " points with a new high score of " + newScore + " points! Keep up the good work."
    return body
}


exports.personalBest = personalBest