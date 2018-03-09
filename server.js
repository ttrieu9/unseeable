var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var mongoUrl = 'mongodb://ttrieu:unseeable@ds259768.mlab.com:59768/unseeable';
var uuidv4 = require('uuid/v4');
var favicon = require('express-favicon');

// Import routes
var logger = require('./routes/logger');
var userId = require('./routes/userId');
var informedConsent = require('./routes/informedConsent');
var iri = require('./routes/iri');
var panas = require('./routes/panas');
var preSurvey = require('./routes/preSurvey');
var postSurvey = require('./routes/postSurvey');

// Set up mongo connection
mongoose.connect(mongoUrl, () => {
  console.log('Connected to MongoDB.')
});

// Get mongoose to use global promise library
mongoose.Promise = global.Promise;

// Get the connection
var db = mongoose.connection;

// Print error if one occurs
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Route handling
app.use(express.static(__dirname));
app.use('/logger', logger);
app.use('/userId', userId);
app.use('/informedConsent', informedConsent);
app.use('/iri', iri);
app.use('/panas', panas);
app.use('/preSurvey', preSurvey);
app.use('/postSurvey', postSurvey);
app.use(favicon(__dirname + '/favicon.png'));

// Title screen
app.get('/', (req, res) => {
  res.sendFile('/index.html');
})

// Load game
app.get('/unseeable', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/game.html'))
})

// Request to go to panas from game
app.get('/unseeable/nextPage', (req, res) => {
  req.on('data', (data) => {

  })

  req.on('end', (data) => {
    res.json({redirect: '/panas2'})
  })
})

// Informed consent
app.get('/informed-consent', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/informedConsent.html'));
});

// Panas1
app.get('/panas1', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/panas.html'));
});

// Panas
app.get('/panas2', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/panas.html'));
});

// IRI
app.get('/iri', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/iri.html'));
});

// Pre-Survey
app.get('/pre-survey', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/preSurvey.html'));
});

// Pre-Survey
app.get('/post-survey', (req, res) => {
  res.sendFile(path.join(__dirname+'/views/postSurvey.html'));
});

var port = process.env.PORT || 8080;

var server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
