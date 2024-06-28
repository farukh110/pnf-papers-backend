const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = Schema({

    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            count: Number,
            color: String
        }
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: ["Not Processed", "Cash on Delivery", "Processing", "Dispatched", "Cancelled", "Delivery"]
    },
    orderBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);