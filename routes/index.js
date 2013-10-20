
/*
 * GET home page.
 */
 var silliness = require('./silliness')

exports.index = function(request, response){
    randQuote = silliness.quotes[Math.floor(Math.random()*silliness.quotes.length)]
    response.redirect('/_:' + randQuote)
}
