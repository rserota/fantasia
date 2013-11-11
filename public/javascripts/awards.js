var hit1 = new Howl({urls : ['../media/sounds/hits/hit1.wav']}),
    hit2 = new Howl({urls : ['../media/sounds/hits/hit2.wav']}),
    hit3 = new Howl({urls : ['../media/sounds/hits/hit3.wav']}),
    hit4 = new Howl({urls : ['../media/sounds/hits/hit4.wav']}),
    hit5 = new Howl({urls : ['../media/sounds/hits/hit5.wav']}),
    hit6 = new Howl({urls : ['../media/sounds/hits/hit6.wav']}),
    hit7 = new Howl({urls : ['../media/sounds/hits/hit7.wav']}),
    hit8 = new Howl({urls : ['../media/sounds/hits/hit8.wav']})

var hits = [hit1, hit2, hit3, hit4, hit5, hit6, hit7, hit8]

$(document).ready(function(){
    $('.awardName').on('click', function(){
        choice = hits[Math.floor(Math.random() * hits.length)]
        choice.play()
    })
    $('.help').on('click', function(){
        $('.feedback').toggleClass('helpText')
    })
})