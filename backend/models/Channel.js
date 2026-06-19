const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['chat', 'calendar'],
    default: 'chat'
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  icon: {
    type: String,
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Channel', channelSchema);
