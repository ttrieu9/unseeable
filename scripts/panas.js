init();

/**
 * Creates event listeners.
 */
function init() {
  let submit = document.getElementById('panas_submit_button');
  submit.addEventListener('click', submitForm)

  for(let i = 1; i <= 20; i++) {
    let id = 'panas_q' + i
    let question = document.getElementById(id);
    question.addEventListener('click', () => {
      removeRedBorder(id)
    })
  }
}

/**
 * Removes red border from questions that have missing responses
 */
function removeRedBorder(id) {
  let question = document.getElementById(id);
  question.classList.remove('missing');
}

/**
 * Sends data to DB if all items are answered.
 */
function submitForm() {
  let answers = recordAnswers();
  let score;

  if(answers.length < 20) {
    markMissingAnswers();
    throw 'Error: there are items left unanswered in the survey.';
  }
  else {
    score = scoreAnswers(answers);
    sendPanas(answers, score);
  }
}

function markMissingAnswers() {
  for(var i = 0; i < 20; i++) {
    let questionId = 'panas_q' + (i + 1);
    let radio = document.getElementsByName(questionId);
    let missing = true;

    for(var j = 0; j < radio.length; j++) {
      if(radio[j].checked) {
        missing = false
      }
    }

    if(missing) {
      document.getElementById(questionId).classList.add('missing');
    }
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
 * Returns JSON object containing positive affect score and negative affect score.
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
  getUserId((userId) => {
    let results = {
      userId: userId,
      answers: answers,
      positiveAffect: score.positive,
      negativeAffect: score.negative
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText)
        document.location.href = response.redirect;
      }
    };
    xhttp.open("POST", "/panas/create", true);
    xhttp.send(JSON.stringify(results));
  })
}

/**
 * Retrieves user id for current session.
 */
function getUserId(cb) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let response = this.responseText
      cb(response)
    }
  };
  xhttp.open("GET", "/userId/retrieve", true);
  xhttp.send();
}
