var express = require('express');
var router = express.Router();

// Require logger controller module
var informed_consent_controller = require('../controllers/informedConsentController');

// Logger routes

// POST informed consent to DB
router.post('/create', informed_consent_controller.create_informed_consent)

module.exports = router;