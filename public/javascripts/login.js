$(document).ready(function(){
    var $signupButtons = $('#buttonContainer').find('.fantastic')
    var $toggleButtons = $('.toggle')
    var $feedback = $('.feedback')
    var $loginform = $('.form')
    var $feedbackLabel = $('#feedbackLabel')
    var mode = ''
    var transitionDelay = 300
    var helpText = 'Welcome to Rad Audio, a training ground and playground for' +
        ' music students, with a primary focus on ear training for musical intervals.' +
        ' Please sign up by choosing a username and password to have your accomplishments ' +
        ' credited to you, or use the Guest Login to quickly try out this site.'

    $signupButtons.on('click', function(){
        if (!$feedback.hasClass('transitioning')){
            if ($(this).hasClass('toggle')){
                $toggleButtons.removeClass('on')
            }
            $(this).addClass('on')
        }
    })
    
    $('.help').on('click', function(){
        if ($feedback.hasClass('login') || $feedback.hasClass('signup')){
            $feedback.removeClass('login').removeClass('signup')
            $loginform.addClass('hidden')
            $feedbackLabel.addClass('hidden')
            $feedback.addClass('transitioning')
            $toggleButtons.removeClass('on')
            setTimeout(function(){
                $feedback.removeClass('transitioning')
                $feedback.addClass('helpText')
                $('.helpTextDiv').text(helpText)
            }, transitionDelay)
        }
        else if ($feedback.hasClass('helpText')){
            $feedback.removeClass('helpText')    
            $('.helpTextDiv').text('')
        }
        else {
            $loginform.addClass('hidden')
            $feedbackLabel.addClass('hidden')
            $feedback.addClass('helpText')
            $('.helpTextDiv').text(helpText)
        }
    })

    $('#login').on('click', function(){
        if(!$feedback.hasClass('login') && !$feedback.hasClass('transitioning')){
            $feedback.removeClass('signup').removeClass('helpText')
            $loginform.addClass('hidden')
            $feedbackLabel.addClass('hidden')
            $feedback.addClass('transitioning')
            mode = 'login'
            $('.username').focus()
            $('.helpTextDiv').text('')
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
            $feedback.removeClass('login').removeClass('helpText')
            $loginform.addClass('hidden')
            $feedbackLabel.addClass('hidden')
            $feedback.addClass('transitioning')
            mode = 'signup'
            $('.username').focus()
            $('.helpTextDiv').text('')
            setTimeout(function(){               
                $feedback.addClass('signup')
                $loginform.removeClass('hidden')
                $feedbackLabel.removeClass('hidden')
                $feedback.removeClass('transitioning')
                $feedbackLabel.text('Sign Up')
            }, transitionDelay)
        }
    })

    var loginFail = function(first, second){
        $feedback.addClass('fail')
        $loginform.addClass('blackout')
        $('.username').attr('placeholder', first).val('')  
        $('.password').attr('placeholder', second).val('')
        $('#submit').addClass('sad')
        setTimeout(function(){
            $feedback.removeClass('fail')
            $loginform.removeClass('blackout')
            $('.username').attr('placeholder', 'Username')        
            $('.password').attr('placeholder', 'Password')
            $('#submit').removeClass('sad')
        }, 1500)
    }

    var postLoginData = function(){
        $.post('/login',{username : $('.username').val(), password : $('.password').val()}, function(data){
            window.location.href = data
        }).fail(function(){
            loginFail('Login', 'Failed')
        })
    }

    var postGuestLogin = function(){
        $.post('/guestLogin',{username : 'Guest', password : 'Guest'}, function(data){
            window.location.href = data
        })  
    }
    
    var postSignupData = function(){
        $.post('/signup', {username : $('.username').val(), password : $('.password').val()}, function(data){
            if (data.code || data.errors){
                if (data.code === 11000){
                    loginFail('Username', 'Taken')
                }
                else if ('username' in data.errors){
                    loginFail('Username', 'Too Short')
                }
                else if ('password' in data.errors){
                    loginFail('Password', 'Too Short')
                }
            }
            else {
                postLoginData()
            }
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
        setTimeout(function(){$('#submit').removeClass('on')},1500)
    })

    $('#guestLogin').on('click', postGuestLogin)

    $('.form').on('keyup', function(event){
        if (event.which === 13){
            postData()
        }
    })


})

