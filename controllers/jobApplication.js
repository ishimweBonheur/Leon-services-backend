const JobApplication = require('../models/application');

exports.submitApplication = async (req, res) => {
  try {
    const application = new JobApplication({
      ...req.body,
      user: req.user._id,
      job: req.params.jobId,
    });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Approve or reject application
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted', 'Rejected', etc.
    
    if (!['Accepted', 'Rejected', 'Reviewed', 'Shortlisted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Find the application and update status along with reviewedBy
    const application = await JobApplication.findByIdAndUpdate(
      req.params.applicationId,
      { 
        status, 
        reviewedBy: req.user._id // Update reviewedBy with the current user
      },
      { new: true }
    );

    if (!application) return res.status(404).json({ error: 'Application not found' });

    res.json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all applications by job
exports.getApplicationsByJob = async (req, res) => {
  try {
    const applications = await JobApplication.find({ job: req.params.jobId }).populate('user');
    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all applications by user
exports.getApplicationsByUser = async (req, res) => {
  try {
    const applications = await JobApplication.find({ user: req.params.userId }).populate('job');
    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get applications by status
exports.getApplicationsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const applications = await JobApplication.find({ status }).populate('user job');
    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
