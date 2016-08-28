// Beat detection
  var beatHoldTime  = 15,   // num of frames to hold a beat (Default: 15)
      beatDecayRate = 0.97, // beat decay rate per frame
      beatMinVol    = 54, // minimum vol to consider a beat
      beatLevelUp   = 1.3, // Beat threashold after detection
      beatCutOff,
      beatTime;

function beatDetection(freq, beatCallback) {
  console.log('DETECT')
  // console.log(freq)
  beatCutOff = beatCutOff || 0;
  beatTime   = beatTime   || 0;

  // Calculate average level across frame
  var level = freq.reduce((p, c) => p + c, 0) / freq.length;
console.log(level)
  // if BEAT!
  if (level > beatCutOff){
    // Re-assign beat cutoff to up the threashold
    beatCutOff = level * beatLevelUp;

    // Start counting beat frames
    beatTime = 0;
console.log('BEAT')
    // Beat!
    return beatCallback(level);

  } else {
    if (beatTime <= beatHoldTime){
      beatTime ++;
    }else{
      beatCutOff = Math.max( beatCutOff * beatDecayRate, beatMinVol );
    }

    // No beat
    return 0;
  }
}
