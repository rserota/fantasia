
var C1 = new Howl({urls : ['../media/sounds/bass/C1.wav'], volume : 0.7}),
    D1 = new Howl({urls : ['../media/sounds/bass/D1.wav'], volume : 0.7}),
    E1 = new Howl({urls : ['../media/sounds/bass/E1.wav'], volume : 0.7}),
    F1 = new Howl({urls : ['../media/sounds/bass/F1.wav'], volume : 0.7}),
    G1 = new Howl({urls : ['../media/sounds/bass/G1.wav'], volume : 0.7}),
    A1 = new Howl({urls : ['../media/sounds/bass/A1.wav'], volume : 0.7}),
    B1 = new Howl({urls : ['../media/sounds/bass/B1.wav'], volume : 0.7}),
    C2 = new Howl({urls : ['../media/sounds/bass/C2.wav'], volume : 0.7}),
    D2 = new Howl({urls : ['../media/sounds/bass/D2.wav'], volume : 0.7}),
    E2 = new Howl({urls : ['../media/sounds/bass/E2.wav'], volume : 0.7}),
    F2 = new Howl({urls : ['../media/sounds/bass/F2.wav'], volume : 0.7}),
    G2 = new Howl({urls : ['../media/sounds/bass/G2.wav'], volume : 0.7}),
    A2 = new Howl({urls : ['../media/sounds/bass/A2.wav'], volume : 0.7}),
    B2 = new Howl({urls : ['../media/sounds/bass/B2.wav'], volume : 0.7})



var song = {
	numSteps : 0,
	notesOn : [[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
	bpm : 120,
	notes : [B2, A2, G2, F2, E2, D2, C2, B1, A1, G1, F1, E1, D1, C1],
    noteNames : ['B', 'A', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'G', 'F', 'E', 'D', 'C'],
	intervalID : undefined,
	TimeoutIDs : [],
    playing : false
}
$(document).ready(function(){
    var setStepHandlers = function(){
        $('.button.stepButton').off('click')
    	$('.button.stepButton').on("click",function(){
            $(this).toggleClass('on')
            var col = $(this).index()
            var row = $(this).parent().index()
            song.notesOn[row][col] = !song.notesOn[row][col]
        })
    }
    
    setStepHandlers()


/** Set up the step counter */
	for (var i = 1; i <= 64; i++){
		$('.stepCounter').append('<div class="stepCount button fantastic">' + i + '</div')
	}
    $('.stepCounter').append('<div class="button fantastic hidden">' + i + '</div')
	$('.stepCount.button').on('click',function(){
        if(!song.playing){
		    $('.button.stepButton').off('click')
		    $('.stepCount.button').removeClass('on')
		    $(this).addClass('on')
		    song.numSteps = $(this).index()+1
		    $('.rowContainer').width(40 * song.numSteps + 600 + 'px')
        }

		for (var i=1; i < $('.row').length+1; i++ ){
			while ($('.row'+i+' .button').length < song.numSteps){
				$('.row'+i).append('<div class="button stepButton fantastic">' + song.noteNames[i-1] + '</div>')
				song.notesOn[i-1].push(false)
			}

		}
		while ($('.row1 .button').length > song.numSteps){
			$('.button.stepButton:last-child').remove()
			for (var i=1; i < $('.row').length+1; i++){
			    song.notesOn[i-1].pop()
		    }
		}
		setStepHandlers()
	})
/*////////////////////////**/

/** Set up the bpm counter */
    for (var i = 2; i <=360; i+=2){
        $('.bpmCounter').append('<div class="bpmCount button fantastic">' + i + '</div')
    }
    $('.bpmCounter').append('<div class="button fantastic hidden">' + i + '</div')
    $('.bpmCount.button').on('click',function(){
        if(!song.playing){
            $('.button.bpmButton').off('click')
            $('.bpmCount.button').removeClass('on')
            $(this).addClass('on')
            song.bpm = ($(this).index()+1)*2
        }
    })

/*///////////////////////*/

/** Main step function */
    var oneStep = function(){
    	$('.stepButton').each(function(){
            var $this = $(this)
            song.TimeoutIDs.push(setTimeout(function(){
                if ($this.hasClass('on')){
                    $this.addClass('playing')
                    // song.notes[$this.parent().index()].stop()
                    song.notes[$this.parent().index()].play()
                    setTimeout(function(){
                        $this.removeClass('playing')
                    }, 300)
                }
            }, (60/song.bpm*1000)*$this.index()))
        })
    }
    var step = function(){
    	oneStep()
       song.intervalID = setInterval(function(){
            oneStep()
        }, (60/song.bpm*1000)*song.numSteps)
    }
/*///////////////////**/


    $('.steppingToggle').on('click',function(){
    	$(this).toggleClass('on')
        song.playing = !song.playing
    	if($(this).hasClass('on')){
    	    step()
    	}
    	else {
    		clearInterval(song.intervalID)
    		for (var i = 0; i < song.TimeoutIDs.length; i++){
    		    clearTimeout(song.TimeoutIDs[i])
    	    }
    	}
    })
    $('.help').on('click',function(){
            $('.feedback').toggleClass('helpText')
    }) 
})

