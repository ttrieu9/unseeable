var PostSurvey = require('../models/postSurvey');

// Create informed consent
exports.create_post_survey = (req, res) => {
  var postSurveyData;

  req.on('data', (data) => {
    postSurveyData = JSON.parse(data);
  });

  req.on('end', (data) => {
    var postSurvey = new PostSurvey(postSurveyData);
    postSurvey.create_post_survey((err, result) => {
      if(err) throw err;

      res.json({result: result, redirect: '/end-screen'}).end()
    });
  });
  console.log('PostSurvey created.')
}