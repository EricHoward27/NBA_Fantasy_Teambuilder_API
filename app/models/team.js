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
  pg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
  },
  sg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
  },
  sf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
  },
  pf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
  },
  c: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Team', teamSchema)
