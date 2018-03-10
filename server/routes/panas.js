var express = require('express');
var router = express.Router();

// Require logger controller module
var panas_controller = require('../controllers/panasController');

// Logger routes

// POST informed consent to DB
router.post('/create', panas_controller.create_panas)

module.exports = router;