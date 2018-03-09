var PreSurvey = require('../models/preSurvey');

// Create informed consent
exports.create_pre_survey = (req, res) => {
  var preSurveyData;

  req.on('data', (data) => {
    preSurveyData = JSON.parse(data);
  });

  req.on('end', (data) => {
    var preSurvey = new PreSurvey(preSurveyData);
    preSurvey.create_pre_survey((err, result) => {
      if(err) throw err;

      res.json({result: result, redirect: '/unseeable'}).end()
    });
  });
  console.log('PreSurvey created.')
}