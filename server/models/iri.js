var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IriSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'Required field missing: "userId".']
  },
  answers: {
    type: Array,
    required: [true, 'Required field missing: "answers".']
  },
  PT: {
    type: Number,
    required: [true, 'Required field missing: "PT".']
  },
  FS: {
    type: Number,
    required: [true, 'Required field missing: "FS".']
  },
  EC: {
    type: Number,
    required: [true, 'Required field missing: "EC".']
  },
  PD: {
    type: Number,
    required: [true, 'Required field missing: "PD".']
  }
})

IriSchema.methods.create_iri = function(cb) {
  return this.save(cb);
};

module.exports = mongoose.model('Iri', IriSchema);