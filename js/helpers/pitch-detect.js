var mediaStreamSource = null

var pitchElem = document.getElementById('pitch-detect-freq')
    noteElem  = document.getElementById('pitch-detect-note')

function error() {alert('Stream generation failed.');}

function getUserMedia(dictionary, callback) {
    try {
        navigator.getUserMedia =
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;
        navigator.getUserMedia(dictionary, callback, error);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }
}

function gotStream(stream) {
  // Create an AudioNode from the stream.
  mediaStreamSource = AUDIO.createMediaStreamSource(stream)
  mediaStreamSource.connect( ANALYSER )
  updatePitch()
}

function toggleLiveInput() {
  getUserMedia({
      "audio": {
        "mandatory": {
        "googEchoCancellation": "false",
        "googAutoGainControl": "false",
        "googNoiseSuppression": "false",
        "googHighpassFilter": "false"
      },
      "optional": []
    },
  }, gotStream)
}

var rafID = null

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

function noteFromPitch( frequency ) {
	var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
	return Math.round( noteNum ) + 69;
}

function frequencyFromNoteNumber( note ) {
	return 440 * Math.pow(2,(note-69)/12);
}


var MIN_SAMPLES = 0
var GOOD_ENOUGH_CORRELATION = 0.9

function autoCorrelate( sampleRate ) {
	var SIZE = TIMEDOMAIN.length;
	var MAX_SAMPLES = Math.floor(SIZE/2);
	var best_offset = -1;
	var best_correlation = 0;
	var rms = 0;
	var foundGoodCorrelation = false;
	var correlations = new Array(MAX_SAMPLES);

	for (var i=0;i<SIZE;i++) {
		var val = TIMEDOMAIN[i];
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);

	if (rms<0.01) // not enough signal
		return -1;

	var lastCorrelation=1;
	for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
		var correlation = 0;

		for (var i=0; i<MAX_SAMPLES; i++) {
			correlation += Math.abs((TIMEDOMAIN[i])-(TIMEDOMAIN[i+offset]));
		}
		correlation = 1 - (correlation/MAX_SAMPLES);
		correlations[offset] = correlation; // store it, for the tweaking we need to do below.
		if ((correlation>GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
			foundGoodCorrelation = true;
			if (correlation > best_correlation) {
				best_correlation = correlation;
				best_offset = offset;
			}
		} else if (foundGoodCorrelation) {
			var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];
			return sampleRate/(best_offset+(8*shift))
		}

		lastCorrelation = correlation
	}

  if (best_correlation > 0.01) return sampleRate/best_offset

	return -1
}

function updatePitch( time ) {
	ANALYSER.getFloatTimeDomainData( TIMEDOMAIN )
	var ac = autoCorrelate( AUDIO.sampleRate )

 	if (ac == -1) {
    // No correlation
    pitchElem.innerText = "--"
		noteElem.innerText = "-"
 	} else {
    // Correlated `ac`
	 	pitch = ac
    var note =  noteFromPitch( pitch )

	 	pitchElem.innerText = Math.round( pitch ) + 'hz'
		noteElem.innerHTML = noteStrings[note%12]
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = window.webkitRequestAnimationFrame

	rafID = window.requestAnimationFrame( updatePitch )
}
