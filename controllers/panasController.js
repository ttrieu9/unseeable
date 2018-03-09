var mongoose = require('mongoose');
var PanasSchema = require('../models/panas');

// Create informed consent
exports.create_panas = (req, res) => {
  var panasData;
  var Panas;

  req.on('data', (data) => {
    panasData = JSON.parse(data);
    Panas = mongoose.model(`${panasData.instance}`, PanasSchema)
    console.log(panasData)
  });

  req.on('end', (data) => {
    var panas = new Panas(panasData.results);
    panas.create_panas((err, result) => {
      if(err) throw err;

      let redirect;
      if(panasData.instance == 'panas1'){
        redirect = '/iri'
      }
      else if(panasData.instance == 'panas2') {
        redirect = '/post-survey'
      }
      
      res.json({result: result, redirect: redirect}).end()
    });
  });
  console.log('Panas created.')
}