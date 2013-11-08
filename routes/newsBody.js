
var personalBest = function(oldScore, newScore){
    var beaten = ['crushed', 'destroyed', 'obliterated', 'demolished', 'stomped', 'beat']
    var choice = beaten[Math.floor(Math.random() * beaten.length)]
    var body = "Wow, congratulations!  You totally " + choice + " your previous high score" + 
        " of " + oldScore + " points with a new high score of " + newScore + " points! Keep up the good work."
    return body
}

var earnedAward = function(awardName){
    var prestigious = ['prestigious', 'honorific', 'rad', 'fabulous', 'magnificent', 'ironic']
    var choice = prestigious[Math.floor(Math.random() * prestigious.length)]
    var councils = ['Council', 'Assembly', 'Committee', 'Board', 'Ministry', 'Conclave']
    var council = councils[Math.floor(Math.random() * councils.length)]
    var body = "After much deliberation, the Awards " + council + " at Rad Audio has voted" +
        " to award you with one of our most " + choice + " awards," +
        '<div class = awardContainer><div class = awardName>' + '"' + awardName + '"</div></div>'
    return body
}

var dailyLeader = function(score){
    var king = ['king', 'lord', 'master']
    var choice = king[Math.floor(Math.random() * king.length)]
    var body = "Oh, wow, look at you!  You're the current " + choice +
        " of the daily leaderboards with your recent score of " + score + " points."
    return body
}

exports.earnedAward = earnedAward
exports.personalBest = personalBest
exports.dailyLeader = dailyLeader