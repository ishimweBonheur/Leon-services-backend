const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
