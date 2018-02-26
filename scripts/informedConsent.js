init();

function init() {
  let submit = document.getElementById('submit_button');
  submit.addEventListener('click', submitForm)

  document.getElementById('e_signature').addEventListener('keyup', (event) => {
    if(event.keyCode === 13) {
      submit.click();
    }
  });
}

function submitForm() {
  var signature = document.getElementById('e_signature').value;

  if(signature == '') {
    alert('Error: You must enter your full name.')
  }
  else {
    sendInformedConsent(signature);
  }
}

function sendInformedConsent(signature) {
  let results = {
    userId = '',
    signature: signature
  }

  // TODO: AJAX POST Request
}