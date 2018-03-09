init()

/**
 * Create event listeners.
 */
function init() {
  var submit = document.getElementById('survey_submit_button');
  submit.addEventListener('click', submitForm)

  var selector = document.getElementById('colorblindness_selector');
  selector.addEventListener('change', detectSelectorChange);
}

/**
 * Reveals input box if user selects "Other..." in dropdown menu.
 */
function detectSelectorChange() {
  var selector = document.getElementById('colorblindness_selector');
  if(selector.options[selector.selectedIndex].value != 'Other...') {
    document.getElementById('q1-1_input').style.display = 'none'
  }
  else {
    document.getElementById('q1-1_input').style.display = 'inline'
  }
}

/**
 * Sends data to DB.
 */
function submitForm() {
  let answers = recordAnswers();
  sendPreSurvey(answers)
}

function recordAnswers() {
  let answers = {
    q1: null,
    q1_1: null,
    q1_2: null,
    q2: null
  }

  let q1 = document.getElementsByName('preSurvey_q1');
  if(q1[0].checked) {
    answers.q1 = parseInt(q1[0].value);
    
    let selector = document.getElementById('colorblindness_selector');
    if(selector.options[selector.selectedIndex].value != 'Other...') {
      answers.q1_1 = selector.options[selector.selectedIndex].value
    }
    else {
      let other = document.getElementById('q1-1_input');
      answers.q1_1 = other.value;
    }
  }
  else if(q1[1].checked) {
    answers.q1 = parseInt(q1[1].value);

    let q1_2 = document.getElementsByName('preSurvey_q1.2');
    for(var i = 0; i < q1_2.length; i++) {
      if(q1_2[i].checked) {
        answers.q1_2 = parseInt(q1_2[i].value);
      }
    }
  }

  let q2 = document.getElementsByName('preSurvey_q2');
  for(var i = 0; i < q2.length; i++) {
    if(q2[i].checked) {
      answers.q2 = parseInt(q2[i].value);
    }
  }

  return answers;
}

function sendPreSurvey(answers) {
    let results = {
      userId: window.sessionStorage.getItem('userId'),
      q1: answers.q1,
      q1_1: answers.q1_1,
      q1_2: answers.q1_2,
      q2: answers.q2
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.responseText)
        document.location.href = response.redirect;
      }
    };
    xhttp.open("POST", "/preSurvey/create", true);
    xhttp.send(JSON.stringify(results));
}

/**
 * Reveals drop down list of colorblindnesses.
 */
function Q1_Yes() {
  var q2 = document.getElementById('q1_no');
  q2.style.display = 'none';
  
  var followUp = document.getElementById('q1_yes');
  followUp.style.display = 'block';
}

/**
 * Reveals binary question to ask about perspective on colorblindness.
 */
function Q1_No() {
  var followUp = document.getElementById('q1_yes');
  followUp.style.display = 'none';

  var q2 = document.getElementById('q1_no');
  q2.style.display = 'block';
}
