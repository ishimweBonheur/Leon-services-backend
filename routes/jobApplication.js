// routes/jobApplication.js
const express = require('express');
const { applyForJob, getAllApplications, updateApplicationStatus } = require('../controllers/jobApplication');
const { authenticate, authorizeRoles } = require('../middlewares/user');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: JobApplications
 *   description: The job application management API
 */

/**
 * @swagger
 * /api/v1/applications/{jobId}:
 *   post:
 *     summary: Apply for a job
 *     tags: [JobApplications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         description: The ID of the job the user is applying for
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user applying for the job
 *               fullName:
 *                 type: string
 *                 description: Full name of the applicant
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the applicant
 *               phoneNumber:
 *                 type: string
 *                 description: Applicant's phone number
 *               location:
 *                 type: string
 *                 description: Location (city, country) of the applicant
 *               coverLetter:
 *                 type: string
 *                 description: A cover letter written by the applicant for the job application
 *               resume:
 *                 type: string
 *                 format: uri
 *                 description: URL or path to the applicant's resume file
 *               cv:
 *                 type: string
 *                 format: uri
 *                 description: URL or path to the applicant's CV file (if separate from the resume)
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       404:
 *         description: Job or User not found
 *       400:
 *         description: User has already applied for this job
 */
router.post('/:jobId', authenticate, applyForJob); // User applies for a job

/**
 * @swagger
 * /api/v1/applications:
 *   get:
 *     summary: Get all job applications
 *     tags: [JobApplications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of job applications with user and job details
 */
router.get('/', authenticate, authorizeRoles('admin'), getAllApplications); // Admin only to view all applications


/**
 * @swagger
 * /api/v1/applications/{applicationId}:
 *   put:
 *     summary: Update application status
 *     tags: [JobApplications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         description: The ID of the application to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['Pending', 'Accepted', 'Rejected']
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Application not found
 */

router.put('/:applicationId', authenticate, authorizeRoles('admin'), updateApplicationStatus); // Admin only to update application status


module.exports = router;
