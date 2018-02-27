var express = require('express');
var router = express.Router();

// Require logger controller module
var post_survey_controller = require('../controllers/postSurveyController');

// Logger routes

// POST informed consent to DB
router.post('/create', post_survey_controller.create_post_survey)

module.exports = router;