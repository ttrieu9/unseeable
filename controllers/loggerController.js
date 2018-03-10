var Log = require('../models/log');
var Task = require('../models/task')

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

// Find logs for a specific level
exports.find_logs = (req, res) => {
  req.on('data', (data) => {
  });

  req.on('end', (data) => {
    Log.find_log(req.params, (err, result) => {
      if (err) throw err;

      res.json(result).end();
    })
  });
  console.log('Found log(s).')
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
      if(err) {
        console.log(err)
        res.json({error:result}).end();
        return;
      }

      res.json({result:result}).end();
      console.log('Log Created.')
    });
  });
};

// Create a task
exports.create_task = (req, res) => {
  var taskData;
  req.on('data', (data) => {
    taskData = JSON.parse(data);
  });

  req.on('end', (data) => {
    var task = new Task(taskData);
    task.create_task((err, result) => {
      if(err) {
        console.log(err)
        res.json({error:result}).end();
        return;
      }

      res.json({result:result}).end();
      console.log('Task Created.')
    });
  });
};