var tones = [
	new Audio('../media/sounds/C1.wav'),
	new Audio('../media/sounds/Db1.wav'),
	new Audio('../media/sounds/D1.wav'),
	new Audio('../media/sounds/Eb1.wav'),
	new Audio('../media/sounds/E1.wav'),
	new Audio('../media/sounds/F1.wav'),
	new Audio('../media/sounds/Gb1.wav'),
	new Audio('../media/sounds/G1.wav'),
	new Audio('../media/sounds/Ab1.wav'),
	new Audio('../media/sounds/A1.wav'),
	new Audio('../media/sounds/Bb1.wav'),
	new Audio('../media/sounds/B1.wav'),
	new Audio('../media/sounds/C2.wav'),
	new Audio('../media/sounds/Db2.wav'),
	new Audio('../media/sounds/D2.wav'),
	new Audio('../media/sounds/Eb2.wav'),
	new Audio('../media/sounds/E2.wav'),
	new Audio('../media/sounds/F2.wav'),
	new Audio('../media/sounds/Gb2.wav'),
	new Audio('../media/sounds/G2.wav'),
	new Audio('../media/sounds/Ab2.wav'),
	new Audio('../media/sounds/A2.wav'),
	new Audio('../media/sounds/Bb2.wav')
];


var enabledIntervals = [
	[false,1],
	[false,2],
	[false,3],
	[false,4],
	[false,5],
	[false,7],
	[false,8],
	[false,9],
	[false,10],
	[false,11],
	[false,12]
];
var keyEvents = [m2Event = $.Event('keydown'),
    M2Event = $.Event('keydown'),
    m3Event = $.Event('keydown'),
    M3Event = $.Event('keydown'),
    P4Event = $.Event('keydown'),
    P5Event = $.Event('keydown'),
    m6Event = $.Event('keydown'),
    M6Event = $.Event('keydown'),
    m7Event = $.Event('keydown'),
    M7Event = $.Event('keydown'),
    OEvent = $.Event('keydown')]

keyEvents[0].which = 81
keyEvents[1].which = 50
keyEvents[2].which = 87
keyEvents[3].which = 51
keyEvents[4].which = 52
keyEvents[5].which = 53
keyEvents[6].which = 84
keyEvents[7].which = 54
keyEvents[8].which = 89
keyEvents[9].which = 55
keyEvents[10].which = 56


var size2KeyCode = function(size){
	if (size === 1){
		return 81
	}
	else if (size === 2){
		return 50
	}
	else if (size === 3){
		return 87
	}
	else if (size === 4){
		return 51
	}
	else if (size === 5){
		return 52
	}
	else if (size === 7){
		return 53
	}
	else if (size === 8){
		return 84
	}
	else if (size === 9){
		return 54
	}
	else if (size === 10){
		return 89
	}
	else if (size === 11){
		return 55
	}
	else if (size === 12){
		return 56
	}

}

var startTime;
var score;

var helpText = 'This app is for aspiring musicians to train their ears to recognize' +
	' musical intervals.  Use the buttons on the right to choose which intervals you' +
    ' want to be tested on.  The more intervals you enable, the more points you earn' +
    " for each correct answer.  When you're ready to start, press the 'GO' button." +
    ' You will have 30 seconds to identify as many intervals as you can.' +
    ' You can identify intervals with the buttons on the right, or you can use your keyboard.' +
    " The keyboard controls are:  (m2nd:'Q') (M2nd:'2') (m3rd:'W') (M3rd:'3')" +
    " (P4th:'4') (P5th:'5') (m6th:'T') (M6th:'6') (m7th:'Y') (M7th:'7') (Oct:'8')"

var definePossibilities = function(intervalsArray){
	possibilities = []
    for (var i = 0; i < intervalsArray.length; i++){
    	if (intervalsArray[i][0]===true){possibilities.push(intervalsArray[i][1])}
    }
	return possibilities
}


var pickNotes = function(possibilities){
	interval = possibilities[Math.floor(Math.random()*possibilities.length)]
	var pick = Math.floor(Math.random()*(22-interval));
	return [tones[pick],tones[pick+interval],interval]
}

var playNotes = function(notes){
	intervalID = setInterval(function(){
		notes[0].currentTime = 0;
		notes[0].play();
		setTimeout(function(){
			notes[1].currentTime = 0;
			notes[1].play();
		},250)
	},500)
	return {"intervalID" : intervalID, "intervalSize" : notes[2]}
}





$(document).ready(function(){

    var feedback = $('.feedback')
    var go = $('.go')

    var setScoreMultiplier = function(){
    	var multiplier = 4
    	for (var i = 0; i < enabledIntervals.length; i++){
    		if (enabledIntervals[i][0] === true){
    			multiplier += 1

    		}
    	}
    	if (multiplier < 6){
    		multiplier = 0
    	}
    	return multiplier
    }

    var setGo = function(){
    	if (go.hasClass("on")){
    		go.removeClass("on")
    	}
    	go.one("click",function(){
            if (setScoreMultiplier() > 0){
        		go.addClass("on")
        		trialLoop() 
            }
            else {
                $('.feedback').addClass('helpText').addClass('bigText')
                $('.feedback').text('Please enable at least two intervals to begin testing. ' +
                 ' Use the buttons on the right to enable or disable intervals.')

                setTimeout(function(){
                    $('.feedback').removeClass('helpText').removeClass('bigText')
                    setGo()
                }, 4000)
            }
        })
    }

    var rightAnswer = function(){
		feedback.toggleClass('right')
		feedback.text('Yup!')
		console.log("correct!")
		score += 1 * scoreMultiplier
		$('.score').text(score + ' Points')
		setTimeout(function(){feedback.toggleClass('right')},700)
    }

    var wrongAnswer = function(){
    	console.log("nope!")
		feedback.toggleClass('wrong')
		feedback.text('Nope!')

		setTimeout(function(){feedback.toggleClass('wrong')},700)
    }

    var trial = function(){
		trialInfo = playNotes(pickNotes(definePossibilities(enabledIntervals)))
		setTimeout(function(){
			$(document).one('keydown',function(event){
				if (event.which === size2KeyCode(trialInfo["intervalSize"])){
					rightAnswer()
				}
				else {
					wrongAnswer()
				}
				clearInterval(trialInfo["intervalID"])
				if (new Date() - startTime < 30000){
					setTimeout(function(){trial()},600)
				}	
				else {
					setGo()
					$('.timer').toggleClass('open')
					$.post('/tonetestscore', {score : score}, function(data){
                        console.log(data)
                    })
					$("#intervalEnabler .button").off("click")
					setEnablerButtons()
				}
			})
        },700)
	}
	
/** Sets up the trial loop, and starts the first trial */
	var trialLoop = function(){
		$('.score').removeClass('open')
		$('.feedback').removeClass('helpText')
		score = 0
		scoreMultiplier = setScoreMultiplier()
		$("#intervalEnabler .button").off("click")
		setPickerButtons()
		setTimeout(function(){
			startTime = new Date();
			$('.score').text('0 Points')
			$('.timer').toggleClass('open')
			$('.score').toggleClass('open')
			setInterval(function(){
    			$(".timer").text(30 - Math.floor((new Date() - startTime)/1000) + ' Seconds')
    		},250)
			trial()
		},300)
	}

	var setPickerButtons = function(){
		$("#intervalEnabler .button").on("click", function(){
			console.log($(this).index())
			console.log(keyEvents[$(this).index()])
			$('body').trigger(keyEvents[$(this).index()])
		})
	}

	var setEnablerButtons = function(){
		$("#intervalEnabler .button").on("click",function(){
			$(this).toggleClass("on")
			console.log($(this).index())
			enabledIntervals[$(this).index()][0] = !enabledIntervals[$(this).index()][0]
		})
    }
    $('.help').on('click',function(){
    	if (!$('.go').hasClass('on')){
    	    $('.feedback').toggleClass('helpText').removeClass('bigText')
    	    $('.feedback').text(helpText)
    	}
    })
    setEnablerButtons()
    setGo()
	
})

















