$(document).ready(function(){
    var $signupButtons = $('#buttonContainer').find('.fantastic')
    $signupButtons.on('click', function(){
        if (!$feedback.hasClass('transitioning')){
            $signupButtons.removeClass('on')
            $(this).addClass('on')
        }
    })

    var $feedback = $('.feedback')
    var $loginform = $('.form')

    $('#login').on('click', function(){
        if(!$feedback.hasClass('login') && !$feedback.hasClass('transitioning')){
            $feedback.removeClass('signup')
            $loginform.addClass('hidden')
            $feedback.addClass('transitioning')
            setTimeout(function(){
                $feedback.addClass('login')
                $loginform.removeClass('hidden')
                $feedback.removeClass('transitioning')
            }, 300)
        }
    })

    $('#signup').on('click', function(){
        if(!$feedback.hasClass('signup') && !$feedback.hasClass('transitioning')){
            $feedback.removeClass('login')
            $loginform.addClass('hidden')
            $feedback.addClass('transitioning')
            setTimeout(function(){
                $feedback.addClass('signup')
                $loginform.removeClass('hidden')
                $feedback.removeClass('transitioning')
            }, 300)
        }
    })
})