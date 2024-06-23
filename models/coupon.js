const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    expiry: {
        type: Date,
        required: true
    },
    discount: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('Coupon', couponSchema);