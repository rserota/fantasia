
/*
 * GET home page.
 */
 var silliness = require('./silliness')

exports.index = function(request, response){
    console.log(request.user)
    randQuote = silliness.quotes[Math.floor(Math.random()*silliness.quotes.length)]
    response.redirect('/:' + randQuote)
    // response.render('index')
}
