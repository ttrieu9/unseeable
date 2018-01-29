var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Required field missing: task "name".']
  },
  duration: {
    type: Number,
    required: [true, 'Required field missing: task "duration".']
  },
  gradingCriteria: {
    type: String,
    required: [true, 'Required field missing: task "gradingCriteria".']
  },
  grade: {
    type: Number,
    required: [true, 'Required field missing: task "grade".']
  }
});

module.exports = TaskSchema;