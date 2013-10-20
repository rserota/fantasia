

$(document).ready(function(){
    $button = $('.button')
    $button.height(28)
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

    $('.button.dropdown').on('click',function(event){
        $this=$(this)
        $button.removeClass('on')
        setTimeout(function(){
            var size = ($this.find('li').size())
            console.log(size)
            var newHeight = (200 + (40*(size-2)))
            $this.height(newHeight)
            
        },1)
    })

    // 
})