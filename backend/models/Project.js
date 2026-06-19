const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  adminUsername: {
    type: String,
    required: true
  },
  adminPassword: {
    type: String,
    required: true
  },
  projectCode: {
    type: String,
    required: true,
    unique: true,
    default: 'PR'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  statusMessage: {
    type: String,
    default: 'مرحباً بك في المشروع'
  },
  projectImage: {
    type: String,
    default: null
  },
  backgroundImage: {
    type: String,
    default: null
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },
  members: [{
    userId: mongoose.Schema.Types.ObjectId,
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  joinRequests: [{
    userId: mongoose.Schema.Types.ObjectId,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
