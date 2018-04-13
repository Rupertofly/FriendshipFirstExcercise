// @ts-check
/* eslint no-undef: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "setup|draw|preload|recordFrame|recordSetup|canvas" }] */

let properties = ['Gender', 'Age', 'No_Of_Friends', 'First_Language'];
let likeProps = ['Likes', 'Dislikes'];

let data = {
  Gender: ['Man', 'Woman', 'Non-Binary'],
  Age: ['18', '25', '30', '38', '45', '55', '75'],
  No_Of_Friends: ['2', '12', '50', '100', '200', '600', '1000', '2000'],
  First_Language: ['English', 'Mandarin', 'Thai', 'Arabic', 'Italian'],
  things: [
    'Superhero movies',
    'AFL',
    'Premier League Soccer',
    'Heavy Metal Music',
    'Memes',
    'Blazing 420',
    'Hip-hop Music',
    'Cocktail Bars',
    'Motorshows',
    'dogs'
  ]
};

// #region Recording
// For Recording

var recorder;
var canvasObject;
var lastFrame = 60;
/**
 * Adds A frame to the recording and saves if at end
 *
 */
function recordFrame () {
  if (frameCount <= lastFrame) {
    recorder.capture(canvasObject);
    if (frameCount === lastFrame) {
      recorder.stop();
      recorder.save();
    }
  }
}
/**
 * Set's up Recording
 *
 */
function recordSetup () {
  recorder = new CCapture({
    format: 'webm',
    framerate: 60
  });
  canvasObject = document.getElementById('defaultCanvas0');
  recorder.start();
}
// #endregion
function preload () {}
let canvas;
let currentQuestion = {};
let yesButton, noButton;
let currentDataSet = [];
let currentQTime, currentQuestionNumber;
var database = firebase.database();
function setup () {
  noCanvas();
  newQuestion();
  let yes = document.getElementById('yesBut');
  let no = document.getElementById('noBut');
  yes.addEventListener('click', function () {
    answer(1);
  });
  no.addEventListener('click', function () {
    answer(0);
  });

  // recordSetup();
}
function mousePressed () {}
function newQuestion () {
  let p1t1 = random(properties);
  let p1d1 = random(data[p1t1]);
  let p1t2 = random() >= 0.5 ? random(likeProps) : random(properties);
  while (p1t1 === p1t2) p1t2 = random(properties);
  let p1d2 =
    p1t2 === 'Likes' || p1t2 === 'Dislikes'
      ? random(data.things)
      : random(data[p1t2]);
  let p1t3 = random(likeProps);
  let p1d3 = random(data.things);
  while (p1d3 === p1d2) p1d3 = random(data.things);

  let p2t1 = random(properties);
  let p2d1 = random(data[p2t1]);
  let p2t2 = random() >= 0.5 ? random(likeProps) : random(properties);
  while (p2t1 === p2t2) p2t2 = random(properties);
  let p2d2 =
    p2t2 === 'Likes' || p2t2 === 'Dislikes'
      ? random(data.things)
      : random(data[p2t2]);
  let p2t3 = random(likeProps);
  let p2d3 = random(data.things);
  while (p2d3 === p2d2) p2d3 = random(data.things);

  currentQuestion = {
    answer: null,
    time: 0,
    p1: {
      t1: { trait: p1t1, val: p1d1 },
      t2: { trait: p1t2, val: p1d2 },
      t3: { trait: p1t3, val: p1d3 }
    },
    p2: {
      t1: { trait: p2t1, val: p2d1 },
      t2: { trait: p2t2, val: p2d2 },
      t3: { trait: p2t3, val: p2d3 }
    }
  };
  let els = [
    select('#p1Trait1'),
    select('#p1Data1'),
    select('#p1Trait2'),
    select('#p1Data2'),
    select('#p1Trait3'),
    select('#p1Data3'),
    select('#p2Trait1'),
    select('#p2Data1'),
    select('#p2Trait2'),
    select('#p2Data2'),
    select('#p2Trait3'),
    select('#p2Data3')
  ];

  els[0].html(p1t1 + ':');
  els[1].html(p1d1);
  els[2].html(p1t2 + ':');
  els[3].html(p1d2);
  els[4].html(p1t3 + ':');
  els[5].html(p1d3);
  els[6].html(p2t1 + ':');
  els[7].html(p2d1);
  els[8].html(p2t2 + ':');
  els[9].html(p2d2);
  els[10].html(p2t3 + ':');
  els[11].html(p2d3);
  console.log(currentDataSet);
  let d = new Date();
  currentQTime = d.getTime();
}

function draw () {
  // recordFrame();
}
function answer (ans) {
  currentQuestion.answer = ans;
  let d = new Date();
  let t = d.getTime();
  currentQuestion.time = t - currentQTime;
  currentDataSet.push(currentQuestion);
  currentQuestionNumber++;
  if (currentQuestionNumber < 15) {
    newQuestion();
  } else {
    expo();
  }
}

function begin () {
  currentQuestionNumber = 0;
  newQuestion();
}
function expo () {
  var currentdate = new Date();
  var datetime =
    'Time Completed: ' +
    currentdate.getDate() +
    '/' +
    (currentdate.getUTCMonth() + 1) +
    '/' +
    currentdate.getUTCFullYear() +
    ' @ ' +
    currentdate.getUTCHours() +
    ':' +
    currentdate.getUTCMinutes() +
    ':' +
    currentdate.getSeconds();
  let ref = database.ref('firstExerciseData');
  let data = {
    data: currentDataSet,
    time: datetime
  };
  ref.push(data);
  window.open('ty.html', '_self');
}
