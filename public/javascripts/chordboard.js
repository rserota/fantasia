var tones = {
	C1: new Howl({urls : ['../media/sounds/treble/C1.wav'], volume : 0.5}),
	Db1: new Howl({urls : ['../media/sounds/treble/Db1.wav'], volume : 0.5}),
	D1: new Howl({urls : ['../media/sounds/treble/D1.wav'], volume : 0.5}),
	Eb1: new Howl({urls : ['../media/sounds/treble/Eb1.wav'], volume : 0.5}),
	E1: new Howl({urls : ['../media/sounds/treble/E1.wav'], volume : 0.5}),
	F1: new Howl({urls : ['../media/sounds/treble/F1.wav'], volume : 0.5}),
	Gb1: new Howl({urls : ['../media/sounds/treble/Gb1.wav'], volume : 0.5}),
	G1: new Howl({urls : ['../media/sounds/treble/G1.wav'], volume : 0.5}),
	Ab1: new Howl({urls : ['../media/sounds/treble/Ab1.wav'], volume : 0.5}),
	A1: new Howl({urls : ['../media/sounds/treble/A1.wav'], volume : 0.5}),
	Bb1: new Howl({urls : ['../media/sounds/treble/Bb1.wav'], volume : 0.5}),
	B1: new Howl({urls : ['../media/sounds/treble/B1.wav'], volume : 0.5}),
	C2: new Howl({urls : ['../media/sounds/treble/C2.wav'], volume : 0.5}),
	Db2: new Howl({urls : ['../media/sounds/treble/Db2.wav'], volume : 0.5}),
	D2: new Howl({urls : ['../media/sounds/treble/D2.wav'], volume : 0.5}),
	Eb2: new Howl({urls : ['../media/sounds/treble/Eb2.wav'], volume : 0.5}),
	E2: new Howl({urls : ['../media/sounds/treble/E2.wav'], volume : 0.5}),
	F2: new Howl({urls : ['../media/sounds/treble/F2.wav'], volume : 0.5}),
	Gb2: new Howl({urls : ['../media/sounds/treble/Gb2.wav'], volume : 0.5}),
	G2: new Howl({urls : ['../media/sounds/treble/G2.wav'], volume : 0.5}),
	Ab2: new Howl({urls : ['../media/sounds/treble/Ab2.wav'], volume : 0.5}),
	A2: new Howl({urls : ['../media/sounds/treble/A2.wav'], volume : 0.5}),
	Bb2: new Howl({urls : ['../media/sounds/treble/Bb2.wav'], volume : 0.5})
}

var chords = {
	alpha:[tones.C1,tones.E1,tones.G1,tones.B1],
	beta:[tones.F1,tones.A1,tones.C2,tones.E2],
	gamma:[tones.G1,tones.B1,tones.D2,tones.F2],
	delta:[tones.A1,tones.C2,tones.E2,tones.G2]
}

var boundChord = chords.alpha

var down7=false
var down8=false
var down9=false
var down0=false

var setToneLabels = function(a,b,c,d){
	$('#7').text(a)
	$('#8').text(b)
	$('#9').text(c)
	$('#0').text(d)
}

$(document).ready(function(){
	$(document).keydown(function(event){
////////// Left hand events		
		if(event.which === 49){
			console.log('1!')
			$('#chords .keybound').removeClass('on')
			$('#1').addClass('on')
			boundChord = chords.alpha
			setToneLabels('C','E','G','B')
		}
		if(event.which === 50){
			console.log('2!')
			$('#chords .keybound').removeClass('on')
			$('#2').addClass('on')
			boundChord = chords.beta
			setToneLabels('F','A','C','E')
		}
		if(event.which === 51){
			console.log('3!')
			$('#chords .keybound').removeClass('on')
			$('#3').addClass('on')
			boundChord = chords.gamma
			setToneLabels('G','B','D','F')
		}
		if(event.which === 52){
			console.log('4!')
			$('#chords .keybound').removeClass('on')
			$('#4').addClass('on')
			boundChord = chords.delta
			setToneLabels('A','C','E','G')
		}

/////////// Right hand events
		if(event.which === 55 && down7===false){
			down7=true
			console.log('7!')
			$('#7').addClass('on')
			boundChord[0].play()
		}
		if(event.which === 56 && down8===false){
			down8=true
			console.log('8!')
			$('#8').addClass('on')
			boundChord[1].play()
		}
		if(event.which === 57 && down9===false){
			down9=true
			console.log('9!')
			$('#9').addClass('on')
			boundChord[2].play()
		}
		if(event.which === 48 && down0===false){
			down0=true
			console.log('0!')
			$('#0').addClass('on')
			boundChord[3].play()
		}
	})
	$(document).keyup(function(event){
		if(event.which === 55){
			console.log('7!')
			$('#7').removeClass('on')
			down7=false
			boundChord[0].stop()

			// boundChord[0].currentTime = 0
		}
		if(event.which === 56){
			console.log('8!')
			$('#8').removeClass('on')
			down8=false
			boundChord[1].stop()
			// boundChord[1].currentTime = 0			
		}
		if(event.which === 57){
			console.log('9!')
			$('#9').removeClass('on')
			down9=false
			boundChord[2].stop()
			// boundChord[2].currentTime = 0
		}
		if(event.which === 48){
			console.log('0!')
			$('#0').removeClass('on')
			down0=false
			boundChord[3].stop()
			// boundChord[3].currentTime = 0
		}
	})
})