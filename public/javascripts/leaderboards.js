$(document).ready(function(){
    $('.help').on('click', function(){
        console.log('help!')
        $('.feedback').toggleClass('helpText')
    })
})