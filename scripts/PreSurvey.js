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