const mongoose = require('mongoose');
const { Schema } = mongoose;

// const orderSchema = Schema({

//     products: [
//         {
//             product: {
//                 type: Schema.Types.ObjectId,
//                 ref: "Product"
//             },
//             count: Number,
//             color: String
//         }
//     ],
//     paymentIntent: {},
//     orderStatus: {
//         type: String,
//         default: "Not Processed",
//         enum: ["Not Processed", "Cash on Delivery", "Processing", "Dispatched", "Cancelled", "Delivery"]
//     },
//     orderBy: {
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     }

// }, {
//     timestamps: true
// });

const orderSchema = Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shippingInfo: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        other: {
            type: String,
            required: false
        },
        pincode: {
            type: Number,
            required: true
        }
    },
    paymentInfo: {
        razorpayOrderId: {
            type: String,
            required: false
        },
        razorpayPaymentId: {
            type: String,
            required: false
        }
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            color: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Color",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },

        }
    ],
    paidAt: {
        type: Date,
        default: Date.now()
    },
    totalPrice: {
        type: Number,
        required: true
    },
    totalPriceAfterDiscount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        default: "Ordered"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);