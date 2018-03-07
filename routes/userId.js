var express = require('express');
var router = express.Router();

// Require logger controller module
var user_id_controller = require('../controllers/userIdController');

// Logger routes

// GET user ID
router.get('/generate', user_id_controller.generate_user_id);

module.exports = router;