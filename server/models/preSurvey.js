var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PreSurveySchema = new Schema({
  userId: {
    type: String,
    unique: true,
    required: [true, 'Required field missing: "userId".']
  },
  q1: String,
  q1_1: String,
  q1_2: String,
  q2: String
})

PreSurveySchema.methods.create_pre_survey = function(cb) {
  return this.save(cb);
};

module.exports = mongoose.model('PreSurvey', PreSurveySchema);