init()

/**
 * Create event listeners.
 */
function init() {
  let submit = document.getElementById('survey_submit_button');
  submit.addEventListener("click", submitForm)
}

/**
 * Sends data to DB.
 */
function submitForm() {
  let answers = recordAnswers();
  sendPostSurvey(answers);
}

function recordAnswers() {
  let answers = [null, null, null, null];

  for(var i = 0; i < 3; i++) {
    let radio = document.getElementsByName('postSurvey_q' + (i + 1));

    for(var j = 0; j < radio.length; j++) {
      if(radio[j].checked) {
        answers[i] = parseInt(radio[j].value);
      }
    }
  }

  let q4 = document.getElementById('postSurvey_q4');
  answers[3] = q4.value;

  return answers;
}

function sendPostSurvey(answers) {
    let results = {
      userId: window.sessionStorage.getItem('userId'),
      q1: answers[0],
      q2: answers[1],
      q3: answers[2],
      q4: answers[3]
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText)
        document.location.href = response.redirect;
      }
    };
    xhttp.open("POST", "/postSurvey/create", true);
    xhttp.send(JSON.stringify(results));
}
