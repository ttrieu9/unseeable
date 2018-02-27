var Panas = require('../models/panas');

// Create informed consent
exports.create_panas = (req, res) => {
  var panasData;

  req.on('data', (data) => {
    panasData = JSON.parse(data);
  });

  req.on('end', (data) => {
    var panas = new Panas(panasData);
    panas.create_panas((err, result) => {
      if(err) throw err;

      res.json({result: result, redirect: '/pre-survey'}).end()
    });
  });
  console.log('Panas created.')
}