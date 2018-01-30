var mongoose = require('mongoose');
var EventSchema = require('./event');
var TaskSchema = require('./task');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
  playerId: {
    type: String,
    required: [true, 'Required field missing: "playerId".']
  },
  levelId: {
    type: String,
    required: [true, 'Required field missing: "levelId".']
  },
  date: {
    type: Date,
    required: [true, 'Required field missing: "date".']
  },
  levelDuration: {
    type: Number
  },
  events: {
    type: [EventSchema]
  },
  tasks: {
    type: [TaskSchema]
  }
});

LogSchema.statics.read_logs = function(cb) {
  return this.find({}, cb);
};

LogSchema.statics.find_log = function(target, cb) {
  return this.find(target, cb);
};

LogSchema.methods.create_log = function(cb) {
  return this.save(cb);
};

module.exports = mongoose.model('Log', LogSchema);