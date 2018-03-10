var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'Required field missing: "userId".']
  },
  levelId: {
    type: String,
    required: [true, 'Required field missing: "levelId".']
  },
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
  },
  additional: Array
});

TaskSchema.methods.create_task = function(cb) {
  return this.save(cb);
};

module.exports = mongoose.model('Task', TaskSchema);