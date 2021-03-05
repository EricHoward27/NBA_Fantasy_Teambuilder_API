const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  abbrv: {
    type: String,
    maxlength: 3
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pointGuard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
  },
  shootingGuard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
  },
  smallForward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
  },
  powerForward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
  },
  Center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Team', teamSchema)
