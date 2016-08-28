var midiNoteNumber = document.getElementById('midi-note-number')
var midiNote = document.getElementById('midi-note')
var midiRatio = document.getElementById('midi-ratio')
var midiFreq = document.getElementById('midi-freq')

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false // this defaults to 'false' and we won't be covering sysex in this article.
    }).then(onMIDISuccess, onMIDIFailure)
} else {
    alert("No MIDI support in your browser.")
}

// midi functions
function onMIDISuccess(midi) {
  var inputs = midi.inputs.values()

  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
    console.log(input)
      if (input.value.manufacturer === 'OWOW') {
        input.value.onmidimessage = _onWob
      } else {
        input.value.onmidimessage = onMIDIMessage
      }
  }
}

function noteToFreq(note){
  return Math.pow(2, (note - 69) / 12) * 440
}

function noteToRatio(note){
  return Math.pow(2, (note - 69) / 12)
}

function onMIDIFailure(e) {
    // when we get a failed response, run this code
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e)
}

function _onWob(message){
  onWob(message)
}

function onMIDIMessage(message) {
    data = message.data; // this gives us our [command/channel, note, velocity] data.

    var data = event.data,
        cmd = data[0] >> 4,
        channel = data[0] & 0xf,
        type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
        note = data[1],
        velocity = data[2]

    if (type === 144) {
      var freq = noteToFreq(note)

      midiNoteNumber.innerText = note
      midiNote.innerText = noteStrings[note%12] + Math.floor((note - 24)/12)
      midiRatio.innerText = noteToRatio(note).toFixed(1)
      midiFreq.innerText = Math.round(freq) + 'hz'

      playADSRWaveshape(freq)
      console.log('MIDI data', data); // MIDI data [144, 63, 73]
    }
}
