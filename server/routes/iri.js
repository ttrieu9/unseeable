var express = require('express');
var router = express.Router();

// Require logger controller module
var iri_controller = require('../controllers/iriController');

// Logger routes

// POST informed consent to DB
router.post('/create', iri_controller.create_iri)

module.exports = router;