var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var mongoUrl = 'mongodb://ttrieu:unseeable@ds239587.mlab.com:39587/unseeable-logger-test';

// Import routes
var logger = require('./routes/logger');

app.use(logger);

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

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})

var server = app.listen(8080, () => {
  console.log('Example app listening at http://localhost:8080');
})

