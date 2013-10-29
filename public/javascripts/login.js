$(document).ready(function(){
    var $signupButtons = $('#buttonContainer').find('.fantastic')
    $signupButtons.on('click', function(){
        $signupButtons.removeClass('on')
        $(this).addClass('on')
    })
})