

$(document).ready(function(){
    $button = $('.navButton')
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

    $('.navButton.dropdown').on('click',function(event){
        $this=$(this)
        $button.removeClass('on')
        setTimeout(function(){
            var size = ($this.find('li').size())
            console.log(size)
            var newHeight = (65 + (36*(size-2)))
            $this.height(newHeight)
            
        },1)
    })
})