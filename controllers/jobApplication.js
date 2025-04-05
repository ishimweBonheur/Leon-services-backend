// controllers/jobApplication.js
const JobApplication = require('../models/jobApplication');
const Job = require('../models/Job');
const User = require('../models/User');

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.body; // Assuming userId comes from the body (you can use req.user.id for authenticated users)

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Check if the user has already applied for the job
    const existingApplication = await JobApplication.findOne({ user: userId, job: jobId });
    if (existingApplication) return res.status(400).json({ msg: 'User has already applied for this job' });

    // Create a new application
    const newApplication = new JobApplication({
      user: userId,
      job: jobId,
      status: 'Pending' // Default status
    });

    await newApplication.save();
    res.status(201).json({ msg: 'Application submitted successfully', application: newApplication });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all job applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate('user', 'fullName userName email') // Fetch user details
      .populate('job', 'title company location'); // Fetch job details

    res.json(applications);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body; // Status can be 'Accepted', 'Rejected', or 'Pending'

    if (!['Accepted', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!updatedApplication) return res.status(404).json({ msg: 'Application not found' });
    res.json({ msg: 'Application status updated successfully', updatedApplication });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
