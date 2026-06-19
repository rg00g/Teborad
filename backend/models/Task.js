const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  assignedTo: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  subtasks: [{
    title: String,
    name: String,
    type: {
      type: String,
      enum: ['text', 'file'],
      default: 'text'
    },
    submissions: [{
      userId: mongoose.Schema.Types.ObjectId,
      content: String,
      fileUrl: String,
      fileName: String,
      submittedAt: Date
    }],
    order: Number
  }],
  taskImage: {
    type: String,
    default: null
  },
  startDate: Date,
  endDate: Date,
  isDateLocked: {
    type: Boolean,
    default: false
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completionPercentage: {
    type: Number,
    default: 0
  },
  viewableBy: {
    type: String,
    enum: ['admins', 'everyone'],
    default: 'admins'
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

module.exports = mongoose.model('Task', taskSchema);
