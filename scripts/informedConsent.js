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
    // TODO: AJAX POST Request
    console.log(signature)
  }
}