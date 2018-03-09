var InformedConsent = require('../models/informedConsent');

// Create informed consent
exports.create_informed_consent = (req, res) => {
  var informedConsentData;

  req.on('data', (data) => {
    informedConsentData = JSON.parse(data);
  });

  req.on('end', (data) => {
    var informedConsent = new InformedConsent(informedConsentData);
    informedConsent.create_informed_consent((err, result) => {
      if(err) throw err;

      res.json({result: result, redirect: '/panas1'}).end()
    });
  });
  console.log('Informed Consent created.')
}