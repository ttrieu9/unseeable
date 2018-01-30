var express = require('express');
var router = express.Router();

// Require logger controller module
var logger_controller = require('../controllers/loggerController');

// Logger routes

// GET all existing logs
router.get('/', logger_controller.read_logs);

// GET logs for a specific level
router.get('/levels/:levelId', logger_controller.find_logs);

// GET logs for a specific player
router.get('/players/:playerId', logger_controller.find_logs)

// POST log to database
router.post('/create', logger_controller.create_log);

module.exports = router;