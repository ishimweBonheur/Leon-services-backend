require('dotenv').config();
const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emails');

/**
 * @swagger
 * /api/email/send:
 *   post:
 *     summary: Send an email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *               - text
 *             properties:
 *               to:
 *                 type: string
 *                 example: ""
 *               subject:
 *                 type: string
 *                 example: "Test Email"
 *               text:
 *                 type: string
 *                 example: "This is a test email."
 *               html:
 *                 type: string
 *                 example: "<p>This is a <strong>test</strong> email.</p>"
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

router.post('/send', sendEmail);

router.get('/test-env', (req, res) => {
  res.json({
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS ? 'Loaded' : 'Not Loaded',
  });
});

module.exports = router;
