var Iri = require('../models/iri');

// Create informed consent
exports.create_iri = (req, res) => {
  var iriData;

  req.on('data', (data) => {
    iriData = JSON.parse(data);
  });

  req.on('end', (data) => {
    var iri = new Iri(iriData);
    iri.create_iri((err, result) => {
      if(err) {
        console.log(err);
        res.json({result: err, redirect: '/iri'}).end()
        return;
      }

      res.json({result: result, redirect: '/pre-survey'}).end()
      console.log('Iri created.')
    });
  });
}