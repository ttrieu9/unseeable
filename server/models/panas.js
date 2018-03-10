var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PanasSchema = new Schema({
  userId: {
    type: String,
    unique: true,
    required: [true, 'Required field missing: "userId".']
  },
  answers: {
    type: Array,
    required: [true, 'Required field missing: "answers".']
  },
  positiveAffect: {
    type: Number,
    required: [true, 'Required field missing: "positiveAffect".']
  },
  negativeAffect: {
    type: Number,
    required: [true, 'Required field missing: "negativeAffect".']
  }
})

PanasSchema.methods.create_panas = function(cb) {
  return this.save(cb);
};

module.exports = PanasSchema;