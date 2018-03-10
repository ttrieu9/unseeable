var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InformedConsentSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    required: [true, 'Required field missing: "userId".']
  },
  signature: {
    type: String,
    required: [true, 'Required field missing: "signature".']
  },
  date: {
    type: Date,
    required: [true, 'Required field missing: "date".']
  },
})

InformedConsentSchema.methods.create_informed_consent = function(cb) {
  return this.save(cb);
};

module.exports = mongoose.model('InformedConsent', InformedConsentSchema);