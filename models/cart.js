const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = Schema({

    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            count: Number,
            color: String,
            price: Number
        }
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);