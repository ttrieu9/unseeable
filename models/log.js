var mongoose = require('mongoose');
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
  startTime: {
    type: Number,
    required: [true, 'Required field missing: "startTime".']
  },
  levelDuration: {
    type: Number
  },
  events: [{type: Schema.Types.ObjectId, ref: 'EventModel'}],
  tasks: [{type: Schema.Types.ObjectId, ref: 'TaskModel'}]
});

module.exports = mongoose.model('LogModel', LogSchema);