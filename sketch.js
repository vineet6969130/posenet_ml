let capture;
let posenet = null;
let singlePose;   // pose of person
let skeleton; 
let actor_img;    // image

function preload() {
  // load image before setup
  actor_img = loadImage('images/srk.png');
}

function setup() {
  createCanvas(640, 480);

  // video capture
  capture = createCapture(VIDEO);
  capture.hide();

  // initialize poseNet
  posenet = ml5.poseNet(capture, modelLoaded);

  // listen to pose events
  posenet.on('pose', receivedPoses);
}

function receivedPoses(poses) {
  if (poses.length > 0) {
    singlePose = poses[0].pose;
    skeleton   = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('PoseNet model loaded ');
}

function draw() {
  image(capture, 0, 0);

  if (singlePose) {
    //  draw keypoints
    fill(255, 0, 0);
    noStroke();
    for (let i = 0; i < singlePose.keypoints.length; i++) {
      let x = singlePose.keypoints[i].position.x;
      let y = singlePose.keypoints[i].position.y;
      ellipse(x, y, 15);
    }

    //  draw skeleton
    stroke(255, 255, 255);
    strokeWeight(3);
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      line(partA.position.x, partA.position.y,
           partB.position.x, partB.position.y);
    }

    //  put image at nose position (keypoint[0])
    let noseX = singlePose.keypoints[0].position.x;
    let noseY = singlePose.keypoints[0].position.y;
    image(actor_img, noseX - 60, noseY - 80, 130, 140);
  }
}