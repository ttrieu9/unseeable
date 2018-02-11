var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var mongoUrl = 'mongodb://ttrieu:unseeable@ds239587.mlab.com:39587/unseeable-logger-test';
var uuidv4 = require('uuid/v4');
var favicon = require('express-favicon');

// Create user ID
const USERID = uuidv4();
console.log(USERID);

// Import routes
var logger = require('./routes/logger');

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
//app.use(favicon(__dirname + '/favicon.png'));

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname + '/favicon.png'));
})
// Load game
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})

var port = process.env.PORT || 8080;

var server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

// app.listen(port);
// console.log(`Example app listening at http://localhost:${port}`);

