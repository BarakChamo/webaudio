
function playFirstDemo(button, event){
  var oscGain = AUDIO.createGain()
  var osc = AUDIO.createOscillator()
  var lfoGain = AUDIO.createGain()
  var lfo = AUDIO.createOscillator()

  // Filter stuff cause god damn
  var filter = AUDIO.createBiquadFilter()

  filter.type = 'lowpass'
  filter.frequency.value = 1000
  filter.connect(OUTPUT)

  // Configure oscillator
  osc.type = 'sawtooth'
  // osc.frequency.value = 173.3
  osc.frequency.value = 173.3

  // Connect oscillator
  osc.connect(oscGain)
  oscGain.connect(filter)

  // Connect LFO
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)

  ANALYSER.smoothingTimeConstant = SMOOTHING
  ANALYSER.fftSize = FFT_SIZE

  drawTimeDomain()

  // Start the visualization
  var interval = setInterval(function(){
    drawTimeDomain()
  }, 1000 / 60)

  // Start oscillator nodes
  osc.start(0)
  lfo.start(0)

  // Set LFO frequency, amplitude, and waveform
  lfo.frequency.value = 1
  lfoGain.gain.value = 700

  // Kill the audio after a timeout
  setTimeout(function(){
    clearInterval(interval)
    CTX2D.clearRect(0, 0, CTX2D.canvas.width, CTX2D.canvas.height)

    lfo.stop()
    osc.stop()
    filter.disconnect(OUTPUT)
    osc = undefined
  }, 5000)
}

function playWaveshape(shape){
  var oscGain = AUDIO.createGain()
  var osc = AUDIO.createOscillator()

  // Configure oscillator
  osc.type = shape
  osc.frequency.value = 173.3

  // Connect oscillator
  osc.connect(oscGain)
  oscGain.connect(OUTPUT)

  drawTimeDomain()

  // Start the visualization
  var interval = setInterval(function(){
    drawTimeDomain()
  }, 1000 / 120)

  // Start oscillator nodes
  osc.start(0)

  // Kill the audio after a timeout
  setTimeout(function(){
    clearInterval(interval)
    CTX2D.clearRect(0, 0, CTX2D.canvas.width, CTX2D.canvas.height)

    osc.stop()
    oscGain.disconnect(OUTPUT)
    osc = undefined
  }, 3000)
}

function playWaveshapeChord(shape, duration){
  var oscGain = AUDIO.createGain()
  var osc1 = AUDIO.createOscillator()
  var osc2 = AUDIO.createOscillator()
  var osc3 = AUDIO.createOscillator()

  // Configure gain
  oscGain.gain.value = 0.5

  // Configure oscillator
  osc1.type = shape
  osc2.type = shape
  osc3.type = shape

  osc1.frequency.value = 173.3
  osc2.frequency.value = 173.3 * 3
  osc3.frequency.value = 173.3 * 2

  // osc1.frequency.value = 173.3
  // osc2.frequency.value = 173.3 * 3
  // osc3.frequency.value = 173.3 * 2

  // Connect oscillator
  osc1.connect(oscGain)
  osc2.connect(oscGain)
  osc3.connect(oscGain)
  oscGain.connect(FILTER)

  drawTimeDomain()

  // Start the visualization
  var interval = setInterval(function(){
    drawTimeDomain()
  }, 1000 / 120)

  // Start oscillator nodes
  osc1.start(0)
  osc2.start(0)
  osc3.start(0)

  // Kill the audio after a timeout
  setTimeout(function(){
    clearInterval(interval)
    CTX2D.clearRect(0, 0, CTX2D.canvas.width, CTX2D.canvas.height)

    osc1.stop()
    osc2.stop()
    osc3.stop()
    oscGain.disconnect(FILTER)
    osc1 = undefined
    osc2 = undefined
    osc3 = undefined
  }, duration || 3000)
}

function playLFOWaveshape(shape, duration){
  var lfoGain = AUDIO.createGain()
  var lfo = AUDIO.createOscillator()

  var oscGain = AUDIO.createGain()
  var osc1 = AUDIO.createOscillator()
  var osc2 = AUDIO.createOscillator()
  var osc3 = AUDIO.createOscillator()

  // Filter stuff cause god damn
  var filter = AUDIO.createBiquadFilter()

  // Configure gain
  oscGain.gain.value = 0.5

  // Configure oscillator
  osc1.type = shape
  osc2.type = shape
  osc3.type = shape

  // osc1.frequency.value = 173.3
  // osc2.frequency.value = 173.3 * 3
  // osc3.frequency.value = 173.3 * 2

  osc1.frequency.value = 173.3
  osc2.frequency.value = 173.3 * 3
  osc3.frequency.value = 173.3 * 2

  // Connect oscillator
  osc1.connect(oscGain)
  osc2.connect(oscGain)
  osc3.connect(oscGain)
  oscGain.connect(filter)

  filter.type = 'lowpass'
  filter.frequency.value = 6000
  filter.Q.value = 5
  filter.connect(OUTPUT)

  // Connect LFO
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)

  // Set LFO frequency, amplitude, and waveform
  lfo.frequency.value = LFO_RATE
  lfoGain.gain.value = 5000

  drawTimeDomain()

  // Start the visualization
  var interval = setInterval(function(){
    lfo.frequency.value = LFO_RATE
    drawTimeDomain()
  }, 1000 / 120)

  // Start LFO
  lfo.start(0)

  // Start oscillator nodes
  osc1.start(0)
  osc2.start(0)
  osc3.start(0)

  // Kill the audio after a timeout
  setTimeout(function(){
    clearInterval(interval)
    CTX2D.clearRect(0, 0, CTX2D.canvas.width, CTX2D.canvas.height)

    lfo.stop()
    osc1.stop()
    osc2.stop()
    osc3.stop()
    oscGain.disconnect(FILTER)
    osc1 = undefined
    osc2 = undefined
    osc3 = undefined
    lfo = undefined
  }, duration || 3000)
}

function playADSRWaveshape(f){
  var gain = AUDIO.createGain(),
		  osc = AUDIO.createOscillator(),
      freq = f || 173.3 //173.3

	gain.connect(OUTPUT)
	gain.gain.setValueAtTime(0, AUDIO.currentTime)
	gain.gain.linearRampToValueAtTime(0.1, AUDIO.currentTime + ENVELOPE.ATTACK / 1000)
	gain.gain.linearRampToValueAtTime(0, AUDIO.currentTime + ENVELOPE.DECAY / 1000 + ENVELOPE.ATTACK / 1000)

	osc.frequency.value = freq
	osc.type = 'square'
	osc.connect(gain)
	osc.start(0)

	setTimeout(function(){
		osc.stop(0)
		osc.disconnect(gain)
		gain.disconnect(OUTPUT)
	}, ENVELOPE.DECAY + ENVELOPE.ATTACK)
}

function playBeat(timeDomain){
  // Set tempo (Beat-Per-Minute) / one minute
  var bpm = 60 / 140
  var beatTime = bpm / 2
  var beats = 4

  vizer = timeDomain ? drawTimeDomain : drawFrequency

  // Start the visualization
  var interval = setInterval(function(){
    vizer()
  }, 1000 / 120)

  setTimeout(function(){
    clearInterval(interval)
    CTX2D.clearRect(0, 0, CTX2D.canvas.width, CTX2D.canvas.height)

  }, 8000)

  // Play 2 bars of the following:
  for (var beat = 0; beat < beats; beat++) {
    var time = AUDIO.currentTime + beat * 8 * beatTime

    // Kick
    playSample(BUFFERS.kick, time + 1 * beatTime)
    playSample(BUFFERS.kick, time + 4 * beatTime)
    playSample(BUFFERS.kick, time + 5 * beatTime)

    // Snares
    playSample(BUFFERS.snare, time + 2 * beatTime)
    playSample(BUFFERS.snare, time + 6 * beatTime)

    // Hihats
    playSample(BUFFERS.closedhihat, time)
    playSample(BUFFERS.closedhihat, time + 1 * beatTime)
    playSample(BUFFERS.closedhihat, time + 2 * beatTime)
    playSample(BUFFERS.openhihat ,time + 3 * beatTime)
    playSample(BUFFERS.closedhihat, time + 4 * beatTime)
    playSample(BUFFERS.closedhihat, time + 5 * beatTime)
    playSample(BUFFERS.closedhihat, time + 6 * beatTime)
    playSample(BUFFERS.openhihat, time + 7 * beatTime)
    playSample(BUFFERS.openhihat, time + 8 * beatTime)

    // Off beat hats
    playSample(BUFFERS.closedhihat, time + 7.5 * beatTime)
    playSample(BUFFERS.closedhihat, time + 8.5 * beatTime)
  }
}

function playAmenBreak(timeDomain){
  vizer = timeDomain ? drawTimeDomain : drawFrequency

  // Start the visualization
  var interval = setInterval(function(){
    vizer()
  }, 1000 / 120)

  setTimeout(function(){
    clearInterval(interval)
    CTX2D.clearRect(0, 0, CTX2D.canvas.width, CTX2D.canvas.height)

  }, BUFFERS.amen.duration * 1000)

  // Play amen break
  playSample(BUFFERS.amen, AUDIO.currentTime)
}

function playBrazil(timeDomain){
  var beatElement = document.getElementById('beat-detect')

  vizer = timeDomain ? drawTimeDomain : drawFrequency

  function onBeat(level){
    beatElement.classList.remove('hidden')
    setTimeout(function(){beatElement.classList.add('hidden')}, 200)
  }

  // Start the visualization
  var interval = setInterval(function(){
    vizer()
    ANALYSER.getByteFrequencyData(FREQUENCIES)
    beatDetection(FREQUENCIES, onBeat)
  }, 1000 / 120)

  setTimeout(function(){
    clearInterval(interval)
    CTX2D.clearRect(0, 0, CTX2D.canvas.width, CTX2D.canvas.height)

  }, BUFFERS.brazil.duration * 1000)

  // Play drum loop
  playSample(BUFFERS.brazil, AUDIO.currentTime)
}

function playAndVisualiseFrequency(){

}

function playAndVisualiseTimeDomain(){

}
