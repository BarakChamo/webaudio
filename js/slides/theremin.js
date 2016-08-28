var thereminOsc = AUDIO.createOscillator()
var thereminGain = AUDIO.createGain()
var thereminHand = document.getElementById('theremin-hand')
var thereminTimeout

thereminOsc.type = 'square'

var thereminAttack = 500
var minFrequency = 20,
    maxFrequency = 2000

thereminOsc.connect(thereminGain)
thereminGain.connect(OUTPUT)
thereminGain.gain.value = 0

thereminOsc.start(AUDIO.currentTime)

var calculateFrequency = function (midiValue) {
  return ((midiValue / 127) * maxFrequency) + minFrequency;
}

var playTheremin = function (midiValue) {
  thereminOsc.frequency.setTargetAtTime(calculateFrequency(midiValue), AUDIO.currentTime, 0.001)
  thereminGain.gain.linearRampToValueAtTime(1.0, AUDIO.currentTime + thereminAttack / 1000)

  clearTimeout(thereminTimeout)
  thereminTimeout = setTimeout(stopTheremin, 500)
};

var stopTheremin = function(){
  thereminGain.gain.linearRampToValueAtTime(0.0, AUDIO.currentTime + thereminAttack / 1000)
};

onWob = function(message){
  thereminHand.style.top = 55 - (message.data[2] / 127) * 55 + '%'
  playTheremin(message.data[2])
}

function updateDisplay(midiValue){
  // update variables
  setVariable('--midi', midiValue)
  setVariable('--midi-range', Math.floor((midiValue / 127) * 100))
  setVariable('--freq', Math.round(((midiValue / 127) * maxFrequency) + minFrequency))

  // Update display values
  for (var i = 0; i < midiValueElems.length; i++) {
    midiValueElems[i].innerText = midiValue
    freqValueElems[i].innerText = Math.round(((midiValue / 127) * maxFrequency) + minFrequency)
  }
}
