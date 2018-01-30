var Log = require('../models/log');

// Display all logs in database
exports.read_logs = (req, res) => {
  console.log('Read all existing logs.');
  res.send('NOT IMPLEMENTED: create_log')
};

// Create a log
exports.create_log = (req, res) => {
  var logData;
  req.on('data', (data) => {
    logData = JSON.parse(data);
  });

  req.on('end', (data) => {
    var log = new Log(logData);
    log.save((err, result) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log('Log posted.');
    })

    res.json(logData).end();
  });

};