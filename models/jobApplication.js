// models/JobApplication.js
const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The user applying for the job
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // The job the user is applying for
    required: true
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
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
