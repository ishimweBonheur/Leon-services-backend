const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contacts');

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact ticket
 *     tags:
 *       - Contacts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               message:
 *                 type: string
 *                 example: I need support with my account.
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', contactController.sendTicket);

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contact tickets
 *     tags:
 *       - Contacts
 *     responses:
 *       200:
 *         description: List of all tickets
 *       500:
 *         description: Internal server error
 */
router.get('/', contactController.getAllTickets);

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get a specific ticket by ID
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the ticket
 *     responses:
 *       200:
 *         description: Ticket details
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', contactController.getTicket);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a specific ticket by ID
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID of the ticket
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', contactController.deleteTicket);

module.exports = router;
