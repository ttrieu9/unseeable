var Log = require('../models/log');

// Display all logs in database
exports.read_logs = (req, res) => {
  req.on('data', (data) => {
  });

  req.on('end', (data) => {
    Log.read_logs((err, result) => {
      if (err) throw err;

      res.json(result).end();
    });
  });
  console.log('Read all logs.');
};

// Create a log
exports.create_log = (req, res) => {
  var logData;
  req.on('data', (data) => {
    logData = JSON.parse(data);
  });

  req.on('end', (data) => {
    var log = new Log(logData);
    log.create_log((err, result) => {
      if (err) throw err;

      res.json(result).end();
    });
  });
  console.log('Log Created.')
};