// routes/job.js
const express = require('express');
const { createJob, getAllJobs, getJobById, updateJob, deleteJob } = require('../controllers/job');
const { authenticate, authorizeRoles } = require('../middlewares/user');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: The job management API
 */

/**
 * @swagger
 * /api/v1/jobs:
 *   post:
 *     summary: Post a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - salary
 *               - company
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               salary:
 *                 type: number
 *               company:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job posted successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticate, authorizeRoles('admin'), createJob); // Admin only

/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: A list of jobs
 */
router.get('/', getAllJobs); // Public access

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the job
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job information
 *       404:
 *         description: Job not found
 */
router.get('/:id', getJobById); // Public access

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   put:
 *     summary: Update a job post
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the job
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               salary:
 *                 type: number
 *               company:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated the job post
 *       403:
 *         description: Not authorized to update job
 *       404:
 *         description: Job not found
 */
router.put('/:id', authenticate, authorizeRoles('admin'), updateJob); // Admin only

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   delete:
 *     summary: Delete a job post
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the job
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the job post
 *       403:
 *         description: Not authorized to delete job
 *       404:
 *         description: Job not found
 */
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteJob); // Admin only

module.exports = router;
