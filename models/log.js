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

module.exports = mongoose.model('Log', LogSchema);