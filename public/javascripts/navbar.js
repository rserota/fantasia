

$(document).ready(function(){
    $button = $('.myNavButton')
    $(document).on('click',function(){
        $button.removeClass('on')
        $button.height(28)
    })

    $button.on('click',function(event){
        $this=$(this)
        $button.removeClass('on')
        setTimeout(function(){
            $this.addClass('on')
        },1)
    })

    $('.myNavButton.myDropdown').on('click',function(event){
        $this=$(this)
        $button.removeClass('on')
        setTimeout(function(){
            var size = ($this.find('li').size())
            console.log(size)
            var newHeight = (60 + (26*(size-2)))
            $this.height(newHeight)
        },1)
    })
})