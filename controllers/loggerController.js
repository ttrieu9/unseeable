var Log = require('../models/log');

// Display all logs in database
exports.read_logs = (req, res) => {
  console.log('Read all existing logs.');
  res.send('NOT IMPLEMENTED: create_log')
};

// Create a log
exports.create_log = (req, res) => {
  console.log('Make a log.');

  var log;
  req.on('data', (data) => {
    log = JSON.parse(data);
  });

  req.on('end', (data) => {
    res.json(log).end();
  });

};