const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },


  cv: String,
  coverLetter: String,
  portfolioUrl: String,
  githubUrl: String,
  linkedInProfile: String,

  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Shortlisted', 'Accepted', 'Rejected'],
    default: 'Pending'
  },
  submissionDate: { type: Date, default: Date.now },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
