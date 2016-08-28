// Draw the visualization
function drawTimeDomain(){
  ANALYSER.smoothingTimeConstant = SMOOTHING
  ANALYSER.fftSize = FFT_SIZE

  // this.ANALYSER.getByteFrequencyData(FREQUENCIES)
  ANALYSER.getFloatTimeDomainData(TIMEDOMAIN)

  CTX2D.clearRect(0, 0, CTX2D.canvas.width, CTX2D.canvas.height)

  CTX2D.beginPath()
  CTX2D.moveTo(0,HEIGHT)
  CTX2D.strokeStyle = '#333'
  CTX2D.lineWidth=15
  CTX2D.lineJoin = CTX2D.lineCap = 'round';
  CTX2D.shadowBlur = 5;
  CTX2D.shadowColor = 'rgb(0, 0, 0)';

  for (var i = 0; i < ANALYSER.frequencyBinCount; i++) {
    var value = TIMEDOMAIN[i]
    // console.log(value)
    var percent = value// / 256
    var height = HEIGHT * percent
    var offset = HEIGHT - height - 1
    var barWidth = WIDTH / ANALYSER.frequencyBinCount
    // CTX2D.fillStyle = 'black'
    // CTX2D.fillRect(i * barWidth, offset, 1, 2)
    CTX2D.lineTo(i * barWidth, offset / 2)
  }

  CTX2D.stroke()
}

function drawFrequency(){
  ANALYSER.smoothingTimeConstant = SMOOTHING
  ANALYSER.fftSize = FFT_SIZE

  ANALYSER.getByteFrequencyData(FREQUENCIES)

  CTX2D.clearRect(0, 0, CTX2D.canvas.width, CTX2D.canvas.height)

  CTX2D.strokeStyle = '#333'
  CTX2D.shadowBlur = 0
  CTX2D.shadowColor = undefined

  var barWidth = (WIDTH / ANALYSER.frequencyBinCount) * 2.5,
      barHeight,
      x = 0;

  for (var i = 0; i < ANALYSER.frequencyBinCount; i++) {
    var value = FREQUENCIES[i]
    barHeight = HEIGHT * (value/256)

    CTX2D.fillStyle = '#333'
    CTX2D.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight)

    x += barWidth + 1
  }

  CTX2D.stroke()
}
