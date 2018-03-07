init();

/**
 * Create event listeners.
 */
function init() {
  let submit = document.getElementById('iri_submit_button');
  submit.addEventListener("click", submitForm);

  for(let i = 1; i <= 28; i++) {
    let id = 'iri_q' + i
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

  if(answers.length < 28) {
    markMissingAnswers();
    throw 'Error: there are items left unanswered in the survey.';
  }
  else {
    score = scoreAnswers(answers);
    sendIri(answers, score);
  }
}

function markMissingAnswers() {
  for(var i = 1; i <= 28; i++) {
    let questionId = 'iri_q' + i;
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

  for(var i = 0; i < 28; i++) {
    var radio = document.getElementsByName('iri_q' + (i + 1));

    for(var j = 0; j < radio.length; j++) {
      if(radio[j].checked) {
        answers.push(parseInt(radio[j].value));
      }
    }
  }

  return answers;
}

/**
 * Returns JSON object containing Perspective-Taking Scale, Fantasty Scale, Empathic Concern Scale, and Personal Distress Scale scores.
 * 
 * @param {*} answers - array of 28 answers to items in IRI. 
 */
function scoreAnswers(answers) {
  let score = {
    PT: 0,
    FS: 0,
    EC: 0,
    PD: 0
  }

  for(var i = 0; i < 28; i++) {
    switch(i) {
      // PT
      case 7:
      case 10:
      case 20:
      case 24:
      case 27:
        score.PT += answers[i];
        break;
      // FS
      case 0:
      case 4:
      case 15:
      case 22:
      case 25:
        score.FS += answers[i];
        break;
      // EC
      case 1:
      case 8:
      case 19:
      case 21:
        score.EC += answers[i];
        break;
      // PD
      case 5:
      case 9:
      case 16:
      case 23:
      case 26:
        score.PD += answers[i];
        break;
      // Reverse PT
      case 2:
      case 14:
        score.PT += 4 - answers[i];
        break;
      // Reverse FS
      case 6:
      case 11:
        score.FS += 4 - answers[i];
        break;
      // Reverse EC
      case 3:
      case 13:
      case 17:
        score.EC += 4 - answers[i];
        break;
      // Reverse PD
      case 12:
      case 18:
        score.PD += 4 - answers[i];    
        break;  
    }
  }

  return score;
}


/**
 * Sends IRI data to MongoDB.
 * 
 * @param {*} answers - answers to 28 IRI questions.
 * @param {*} score - Perspective-Taking Scale, Fantasty Scale, Empathic Concern Scale, and Personal Distress Scale scores.
 */
function sendIri(answers, score) {
  getUserId((userId) => {
    let results = {
      userId: userId,
      answers: answers,
      PT: score.PT,
      FS: score.FS,
      EC: score.EC,
      PD: score.PD
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText)
        document.location.href = response.redirect;
      }
    };
    xhttp.open("POST", "/iri/create", true);
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
