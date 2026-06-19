const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  senderUsername: String,
  type: {
    type: String,
    enum: ['important', 'general', 'private'],
    default: 'general'
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadedAt: Date
  }],
  voiceMessage: {
    duration: Number, // بالثواني (حد أقصى 60)
    audioUrl: String
  },
  mentions: [mongoose.Schema.Types.ObjectId],
  reactions: [{
    emoji: String,
    userId: mongoose.Schema.Types.ObjectId,
    username: String
  }],
  stickers: [{
    stickerId: String,
    userId: mongoose.Schema.Types.ObjectId
  }],
  repliedTo: {
    messageId: mongoose.Schema.Types.ObjectId,
    content: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);
