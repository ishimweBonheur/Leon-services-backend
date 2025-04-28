
const Subscription = require('../models/subscription');

// Create a new subscription
exports.createSubscription = async (req, res) => {
    try {
        const { name, email } = req.body;

        const newSubscription = new Subscription({ name, email });
        await newSubscription.save();

        res.status(201).json({ message: 'Subscription created successfully', subscription: newSubscription });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create subscription', error: error.message });
    }
};

// Get all subscriptions
exports.getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subscriptions', error: error.message });
    }
};
// Get a subscription by ID
exports.getSubscriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const subscription = await Subscription.findById(id);

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subscription', error: error.message });
    }
};


// Delete a subscription by ID
exports.deleteSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        await Subscription.findByIdAndDelete(id);
        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete subscription', error: error.message });
    }
};
