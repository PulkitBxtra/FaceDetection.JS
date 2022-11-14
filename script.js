const video = document.getElementById('video')

navigator.permissions.query({name: 'camera'})
 .then((permissionObj) => {
  console.log(permissionObj.state);

    if(permissionObj.state=='denied'){
      alert("Give permissions to turn your camera on");

    }

 })
 .catch((error) => {
  console.log('Got error :', error);
 })

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

var Detected=0;
var NotDetected=0;

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)



  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    
    console.log(detections);

    if(detections.length > 0) {
      Detected++;
      console.log(`Face detected ${Detected}`);
    }

    if(detections.length==0) {
      NotDetected++;
      console.log(`Face Not detected ${NotDetected}`);
    }



  }, 100)
})



function reveal(){
  document.getElementById('levels').innerText=`Focus:${Detected} Unfocus:${NotDetected}`;
  console.log(`${Detected} ${NotDetected}`)
}
