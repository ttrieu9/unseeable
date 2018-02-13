var mongoose = require('mongoose');
var MouseCoordinateSchema = require('./mouseCoordinate');
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
    type: MouseCoordinateSchema,
    required: [true, 'Required field missing: event "mouseCoordinate".']
  }
});

module.exports = EventSchema;