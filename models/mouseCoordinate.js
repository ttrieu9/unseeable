var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MouseCoordinateSchema = new Schema({
  x: {
    type: Number,
    required: [true, 'Required field missing: mouseCoordinate "x".']
  },
  y: {
    type: Number,
    required: [true, 'Required field missing: mouseCoordinate "y".']
  }
});

module.exports = MouseCoordinateSchema;