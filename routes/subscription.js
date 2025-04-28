const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription');

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Subscription management API
 */

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *       500:
 *         description: Failed to create subscription
 */
router.post('/', subscriptionController.createSubscription);

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: List of subscriptions
 *       500:
 *         description: Failed to fetch subscriptions
 */
router.get('/', subscriptionController.getSubscriptions);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   get:
 *     summary: Get a subscription by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription found
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Failed to fetch subscription
 */
router.get('/:id', subscriptionController.getSubscriptionById);

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Delete a subscription by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription deleted successfully
 *       500:
 *         description: Failed to delete subscription
 */
router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router;
