const JobApplication = require('../models/application');

// Submit a job application
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
    const { status } = req.body;

    if (!['Accepted', 'Rejected', 'Reviewed', 'Shortlisted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await JobApplication.findByIdAndUpdate(
      req.params.applicationId,
      {
        status,
        reviewedBy: req.user._id,
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
    const applications = await JobApplication.find({ job: req.params.jobId })
      .populate('user', 'name email')
      .populate('job', 'title');

    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all applications by user
exports.getApplicationsByUser = async (req, res) => {
  try {
    const applications = await JobApplication.find({ user: req.params.userId })
      .populate('job', 'title')
      .populate('user', 'name email');

    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get applications by status
exports.getApplicationsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const applications = await JobApplication.find({ status })
      .populate('user', 'name email')
      .populate('job', 'title');

    res.json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
