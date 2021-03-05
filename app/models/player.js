const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    enum: ['pg', 'sg', 'sf', 'pf', 'c'],
    required: true
  },
  points: {
      type: Number,
      required: true
  },
  assists: {
      type: Number,
      required: true
  },
  rebounds: {
      type: Number,
      required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Player', playerSchema)
