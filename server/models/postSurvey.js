var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSurveySchema = new Schema({
  userId: {
    type: String,
    unique: true,
    required: [true, 'Required field missing: "userId".']
  },
  q1: Number,
  q2: Number,
  q3: Number,
  q4: String
})

PostSurveySchema.methods.create_post_survey = function(cb) {
  return this.save(cb);
};

module.exports = mongoose.model('PostSurvey', PostSurveySchema);