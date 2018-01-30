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
  grade: {
    type: Number,
    required: [true, 'Required field missing: task "grade".']
  }
});

module.exports = TaskSchema;