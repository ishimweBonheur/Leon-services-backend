const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', 
    required: true
  },
  fullName: {
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true 
  },
  phoneNumber: {
    type: String,
    required: false 
  },
  location: {
    type: String,
    required: false 
  },
  coverLetter: {
    type: String,
    required: false 
  },
  resume: {
    type: String,
    required: false 
  },
  cv: {
    type: String,
    required: false 
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true }); // Timestamps for createdAt and updatedAt fields

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
