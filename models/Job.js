const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],            // custom job requirements
  responsibilities: [String],  
  endDate:{ type: Date, required: true },
  employmentType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract'],
    default: 'Full-Time'
  },
  salary: { type: Number },
  location: { type: String, required: true },
  remote: { type: Boolean, default: false },
  company: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicationDeadline: Date,
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open'
  },

  requirementsConfig: {
    cv: { type: Boolean, default: false },
    coverLetter: { type: Boolean, default: false },
    portfolio: { type: Boolean, default: false },
    github: { type: Boolean, default: false },
    linkedIn: { type: Boolean, default: false },
  }

}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
