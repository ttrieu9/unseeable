init();

/**
 * Creates event listeners.
 */
function init() {
  let submit = document.getElementById('submit_button');
  submit.addEventListener('click', submitForm);

  document.getElementById('e_signature').addEventListener('keyup', (event) => {
    if(event.keyCode === 13) {
      submit.click();
    }
  });
}

/**
 * Sends form data to DB if user provides e-signature.
 */
function submitForm() {
  var signature = document.getElementById('e_signature').value;

  if(signature == '') {
    alert('Error: You must enter your full name.')
  }
  else {
    sendInformedConsent(signature);
  }
}

/**
 * Persists informed consent data to db (signature, userid, date).
 * 
 * @param {String} signature - Full name of participant.
 */
function sendInformedConsent(signature) {
  let results = {
    userId = '',
    signature: signature,
    date: new Date()
  }

  // TODO: AJAX POST Request
}

/**
 * Retrieves user id for current session.
 */
function getUserId() {
  let userId;

  // TODO: AJAX GET Request

  return userId;
}