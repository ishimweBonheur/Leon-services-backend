const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job');
const { authenticate, authorizeRoles } = require('../middlewares/user');


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - location
 *         - company
 *         - endDate
 *         - postedBy
 *       properties:
 *         title:
 *           type: string
 *           example: "Frontend Developer"
 *         description:
 *           type: string
 *           example: "We are looking for a skilled frontend developer..."
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *           example: ["HTML", "CSS", "React"]
 *         responsibilities:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Develop UI components", "Collaborate with backend team"]
 *         endDate:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         employmentType:
 *           type: string
 *           enum: [Full-Time, Part-Time, Internship, Contract]
 *           example: Full-Time
 *         salary:
 *           type: number
 *           example: 80000
 *         location:
 *           type: string
 *           example: "Kigali, Rwanda"
 *         remote:
 *           type: boolean
 *           example: true
 *         company:
 *           type: string
 *           example: "Tech Solutions Ltd"
 *         postedBy:
 *           type: string
 *           description: "User ID who posted the job"
 *           example: "644a3fa7bcd35b2d88c3c111"
 *         applicationDeadline:
 *           type: string
 *           format: date
 *           example: "2025-05-15"
 *         status:
 *           type: string
 *           enum: [Open, Closed]
 *           example: Open
 *         requirementsConfig:
 *           type: object
 *           properties:
 *             cv:
 *               type: boolean
 *               example: true
 *             coverLetter:
 *               type: boolean
 *               example: false
 *             portfolio:
 *               type: boolean
 *               example: true
 *             github:
 *               type: boolean
 *               example: false
 *             linkedIn:
 *               type: boolean
 *               example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-06T08:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-06T08:00:00.000Z"
 */

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Job created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, authorizeRoles('admin'), jobController.createJob);

/**
 * @swagger
 * /jobs/{jobId}:
 *   put:
 *     summary: Update a job
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:jobId', authenticate, authorizeRoles('admin'), jobController.updateJob);

/**
 * @swagger
 * /jobs/{jobId}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Job]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized
 * 
 */
router.delete('/:jobId', authenticate, authorizeRoles('admin'), jobController.deleteJob);
router.get('/', jobController.getJobs);
module.exports = router;
