init();

function init() {
  var submit = document.getElementById('panas_submit_button');
  submit.addEventListener('click', submitForm)
}

function submitForm() {
  // TODO: Score Panas
  console.log('Score Panas')
  let answers = recordAnswers();

  // TODO: AJAX POST Request
  console.log('Send Panas')
}

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