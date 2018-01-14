var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  type: {
    type: String,
    required: [true, 'Required field missing: event "type".']
  },
  time: {
    type: Number,
    required: [true, 'Required field missing: event "time".']
  },
  mouseCoordinate: {
    type: Schema.Types.ObjectId,
    ref: 'MouseCoordinateModel',
    required: [true, 'Required field missing: event "mouseCoordinate".']
  }
});

module.exports = mongoose.model('EventModel', EventSchema);