var express = require('express');
var router = express.Router();

// Require logger controller module
var logger_controller = require('../controllers/loggerController');

// Logger routes

// GET all existing logs
router.get('/', logger_controller.read_logs);

// POST log to database
router.post('/create', logger_controller.create_log);

module.exports = router;