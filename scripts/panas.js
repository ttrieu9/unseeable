init();

function init() {
  var submit = document.getElementById('panas_submit_button');
  submit.addEventListener('click', submitForm)
}

function submitForm() {
  let answers = recordAnswers();
  let score;

  if(answers.length < 20) {
    alert('Error: there are items left unanswered in the survey.')
    throw 'Error: there are items left unanswered in the survey.';
  }
  else {
    score = scoreAnswers(answers);

    postPanas(answers, score);
  }
}

/** 
 * Records answers of radio buttons selected by user.
*/
function recordAnswers() {
  let answers = [];

  for(var i = 0; i < 20; i++) {
    var radio = document.getElementsByName('panas_q' + (i + 1));

    for(var j = 0; j < radio.length; j++) {
      if(radio[j].checked) {
        answers.push(parseInt(radio[j].value));
      }
    }
  }

  return answers;
}

/**
 * Returns JSON object containg positive affect score and negative affect score.
 * 
 * @param {*} answers - array of 20 answers to items in PANAS. 
 */
function scoreAnswers(answers) {
  let score = {
    positive: 0,
    negative: 0
  }

  for(var i = 0; i < 20; i++) {
    switch(i) {
      case 0:
      case 2:
      case 4:
      case 8:
      case 9:
      case 11:
      case 13:
      case 15:
      case 16:
      case 18:
        score.positive += answers[i];
        break;
      case 1:
      case 3:
      case 5:
      case 6:
      case 7:
      case 10:
      case 12:
      case 14:
      case 17:
      case 19:
        score.negative += answers[i];
        break;
    }
  }

  return score;
}

/**
 * Sends PANAS data to MongoDB.
 * 
 * @param {*} answers - answers to 20 PANAS questions.
 * @param {*} score - positive affect and negative affect scores.
 */
function sendPanas(answers, score) {
  let results = {
    userId: '',
    answers: answers,
    positiveAffect: score.positive,
    negativeAffect: score.negative
  }

  // TODO: AJAX POST Request
}