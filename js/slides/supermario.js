var NOTE_FREQS = { 'C4':261.6, 'C#4':277.2, 'D4':293.7, 'D#4':311.1, 'E4':329.6, 'F4':349.2, 'F#4':370, 'G4':392, 'G#4':415.3, 'A5':440, 'A#5':466.2, 'B5':493.9, 'C5':523.3, 'C#5':554.4, 'D5':587.3, 'D#5':622.3, 'E5':659.3, 'F5':698.5, 'F#5':740, 'G5':784, 'G#5':830.6, 'A6':880, 'A#6':932.3, 'B6':987.8, 'C6':1046.5 },

song = [
	'F#4,E5','F#4,E5','-','F#4,E5','-','F#4,C5','F#4,E5','-','G4,A5,G5','-','-','-','G4,G4','-','-','-',
	// 'E4,C5','-','-','G4,E4','-','-','C4,E4','-','-','C4,A5','-','D4,B5','-','C#4,A#5','C4,A5','-',
	// 'C4,G4','G4,E5','B5,G5','C5,A5','-','A5,F5','-','B5,G5','-','G4,E5','-','E4,C5','F4,D5','D4,B5','-','-',
	// 'E4,C5','-','-','G4,E4','-','-','C4,E4','-','-','C4,A5','-','D4,B5','-','C#4,A#5','C4,A5','-',
	// 'C4,G4','G4,E5','B5,G5','C5,A5','-','A5,F5','-','B5,G5','-','G4,E5','-','E4,C5','F4,D5','D4,B5','-','-',
	// 'B5,B5','-','E5,G5','D#5,F#5','D5,F5','C5,D5','-','C5,E5','-','G#4,G#4','A5,A5','E4,C5','-','A5,A5','E4,C5','D5,D5',
	// 'B5,B5','-','E5,G5','D#5,F#5','D5,F5','C5,D5','-','C5,E5','-','F5,C6','-','F5,C6','F5,C6','-','G4,G4','-',
	// 'B5,B5','-','E5,G5','D#5,F#5','D5,F5','C5,D5','-','C5,E5','-','G#4,G#4','A5,A5','E4,C5','-','A5,A5','E4,C5','D5,D5',
	// '-','-','G#4,D#5','-','-','F4,D5','-','-','E4,C5','-','-','G4,G4','G4,G4','-','C4,C4','-'
]

function createOscillator(freq) {
	var attack = 10,
		decay = 250,
		gain = AUDIO.createGain(),
		osc = AUDIO.createOscillator()

	gain.connect(OUTPUT)
	gain.gain.setValueAtTime(0, AUDIO.currentTime)
	gain.gain.linearRampToValueAtTime(0.1, AUDIO.currentTime + attack / 1000)
	gain.gain.linearRampToValueAtTime(0, AUDIO.currentTime + decay / 1000)

	osc.frequency.value = freq;
	osc.type = 'square'
	osc.connect(gain)
	osc.start(0)

	setTimeout(function(){
		osc.stop(0)
		osc.disconnect(gain)
		gain.disconnect(OUTPUT)
	}, decay)
}

function playSuperMario(){
  var position = 0,
      tempo = 100,
      delay = MS / tempo / 4, // quarter note / 4 for sixteenths
      loop,
      playing = true

  function play() {
  	var notes = song[position], i = 0, l = notes.length, freq
  	position += 1

  	if (position >= song.length) {
  		position = 0

  		clearTimeout(loop)
  		playing = false
  	}

  	if (notes !== '-') {
  		notes = notes.split(',')
  		l = notes.length
  		for (; i < l; i++) createOscillator(NOTE_FREQS[notes[i]])
  	}

  	if (playing) loop = setTimeout(play, delay)
  }

  play()
}
