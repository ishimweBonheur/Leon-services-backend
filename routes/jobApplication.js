const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/jobApplication');
const { authenticate, authorizeRoles } = require('../middlewares/user');

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: The user who is applying for the job
 *           example: "60b8d56e5f87e99b7d7c8e23"
 *         job:
 *           type: string
 *           description: The job ID the user is applying for
 *           example: "60b8d5ab5f87e99b7d7c8e24"
 *         cv:
 *           type: string
 *           description: The CV file URL or file path
 *           example: "https://example.com/cv.pdf"
 *         coverLetter:
 *           type: string
 *           description: The cover letter file URL or file path
 *           example: "https://example.com/coverLetter.pdf"
 *         portfolioUrl:
 *           type: string
 *           description: The user's portfolio URL (optional)
 *           example: "https://portfolio.com/john_doe"
 *         githubUrl:
 *           type: string
 *           description: The user's GitHub URL (optional)
 *           example: "https://github.com/johndoe"
 *         linkedInProfile:
 *           type: string
 *           description: The user's LinkedIn profile URL (optional)
 *           example: "https://linkedin.com/in/johndoe"
 *         status:
 *           type: string
 *           enum: ["Pending", "Reviewed", "Shortlisted", "Accepted", "Rejected"]
 *           description: The application status
 *           example: "Pending"
 *         submissionDate:
 *           type: string
 *           format: date-time
 *           description: The date the application was submitted
 *           example: "2025-04-08T12:00:00Z"
 *         reviewedBy:
 *           type: string
 *           description: The user who reviewed the application (optional)
 *           example: "60b8d56e5f87e99b7d7c8e23"
 */

/**
 * @swagger
 * /api/applications/{jobId}/apply:
 *   post:
 *     summary: Submit application to a job
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Application'
 *     responses:
 *       201:
 *         description: Application submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Application submitted successfully"
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/applications/{applicationId}/status:
 *   patch:
 *     summary: Update application status
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
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
 *                 enum: ["Pending", "Reviewed", "Shortlisted", "Accepted", "Rejected"]
 *                 description: The new status of the application
 *                 example: "Reviewed"
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Application status updated"
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/applications/by-job/{jobId}:
 *   get:
 *     summary: Get applications by job
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Applications retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid jobId parameter
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/applications/by-user/{userId}:
 *   get:
 *     summary: Get applications by user
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Applications retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid userId parameter
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/applications/by-status/{status}:
 *   get:
 *     summary: Get applications by status
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["Pending", "Reviewed", "Shortlisted", "Accepted", "Rejected"]
 *     responses:
 *       200:
 *         description: Applications retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid status parameter
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.post('/:jobId/apply', authenticate, applicationController.submitApplication);
router.patch('/:applicationId/status', authenticate, authorizeRoles('admin'), applicationController.updateApplicationStatus);
router.get('/by-job/:jobId', authenticate, applicationController.getApplicationsByJob);
router.get('/by-user/:userId', authenticate, applicationController.getApplicationsByUser);
router.get('/by-status/:status', authenticate, authorizeRoles('admin'), applicationController.getApplicationsByStatus);
router.get('/', authenticate, applicationController.getAllApplications);

module.exports = router;
