$(document).ready(function(){
    var $signupButtons = $('#buttonContainer').find('.fantastic')
    var $toggleButtons = $('.toggle')
    var $feedback = $('.feedback')
    var $loginform = $('.form')
    var $feedbackLabel = $('#feedbackLabel')
    var mode = ''
    var transitionDelay = 300

    $signupButtons.on('click', function(){
        if (!$feedback.hasClass('transitioning')){
            if ($(this).hasClass('toggle')){
                $toggleButtons.removeClass('on')
            }
            $(this).addClass('on')
        }
    })

    $('#login').on('click', function(){
        if(!$feedback.hasClass('login') && !$feedback.hasClass('transitioning')){
            $feedback.removeClass('signup')
            $loginform.addClass('hidden')
            $feedbackLabel.addClass('hidden')
            $feedback.addClass('transitioning')
            mode = 'login'
            setTimeout(function(){
                $feedback.addClass('login')
                $loginform.removeClass('hidden')
                $feedbackLabel.removeClass('hidden')
                $feedback.removeClass('transitioning')
                $feedbackLabel.text('Log In')
            }, transitionDelay)
        }
    })

    $('#signup').on('click', function(){
        if(!$feedback.hasClass('signup') && !$feedback.hasClass('transitioning')){
            $feedback.removeClass('login')
            $loginform.addClass('hidden')
            $feedbackLabel.addClass('hidden')
            $feedback.addClass('transitioning')
            mode = 'signup'
            setTimeout(function(){
                $feedback.addClass('signup')
                $loginform.removeClass('hidden')
                $feedbackLabel.removeClass('hidden')
                $feedback.removeClass('transitioning')
                $feedbackLabel.text('Sign Up')
            }, transitionDelay)
        }
    })

    var loginFail = function(action){
        $feedback.addClass('fail')
        $loginform.addClass('blackout')
        $('.username').attr('placeholder', action)        
        $('.password').attr('placeholder', 'Failed')
        setTimeout(function(){
            $feedback.removeClass('fail')
            $loginform.removeClass('blackout')
            $('.username').attr('placeholder', 'Username')        
            $('.password').attr('placeholder', 'Password')
        }, 1500)
    }
    var postLoginData = function(){
        $.post('/login',{username : $('.username').val(), password : $('.password').val()}, function(data){
            window.location.href = data
        }).fail(function(){
            loginFail('Login')
            console.log('fail!')
        })
    }
    
    var postSignupData = function(){
        $.post('/signup', {username : $('.username').val(), password : $('.password').val()}, function(data){

        })
    }

    var postData = function(){
        if (mode === 'login'){
            postLoginData()
        }
        else if (mode === 'signup'){
            postSignupData()
        }
    }



    $('#submit').on('click', function(){
        postData()
        setTimeout(function(){$('#submit').removeClass('on')},700)
    })
    $('.form').on('keyup', function(event){
        if (event.which === 13){
            postData()
        }
    })


})

