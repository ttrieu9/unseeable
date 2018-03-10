var express = require('express');
var router = express.Router();

// Require logger controller module
var pre_survey_controller = require('../controllers/preSurveyController');

// Logger routes

// POST informed consent to DB
router.post('/create', pre_survey_controller.create_pre_survey)

module.exports = router;