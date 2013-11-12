$(document).ready(function(){
    var $feedback = $('.feedback')
    var mode = ''
    var cantDeleteGuest = function(){
        console.log('Cant delete guest!')
        $feedback.removeClass('openConfirm')
        $('.confirmButton').removeClass('on')
        $('#confirm').removeClass('on')
        setTimeout(function(){
            $('#helpTextBox').text("You can't delete the guest account...")
            $('#helpTextBox').removeClass('hidden')
            $('#confirmBox').addClass('hidden')
            $feedback.addClass('helpText')
        },400)

    }

    $('.confirmButton').on('click', function(){
        $('#helpTextBox').addClass('hidden')
        $('.confirmButton').removeClass('on')
        $(this).addClass('on')
        $feedback.removeClass('helpText')
        setTimeout(function(){
            $('#confirmBox').removeClass('hidden')
            $feedback.addClass('openConfirm')
        },400)
    })

    $('.deleteAccountButton').on('click', function(){
        mode = 'deleteaccount'
    })

    $('#cancel').on('click', function(){
        $this = $(this)
        $this.addClass('on')
        $feedback.removeClass('openConfirm')
        $('.confirmButton').removeClass('on')
        setTimeout(function(){
            $this.removeClass('on')
            $('#confirmBox').addClass('hidden')
        }, 400)
    })

    $('#confirm').on('click', function(){
        $(this).addClass('on')
        if (mode === 'deleteaccount'){
            $.post('/deleteaccount', {}, function(data){
                if (data === 'Guest'){
                    cantDeleteGuest()
                }
                else {
                    window.location.href = data
                }
            })
        }
    })
})
