const mongoose = require('mongoose');

const storageSchema = new mongoose.Schema({
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    createdDate: {
        type: Date,
        default: Date.now
    },
    executedDate: {
        type: Date,
        default: null
    },
    executedBy: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Storage', storageSchema);
