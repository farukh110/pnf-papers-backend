const mongoose = require('mongoose');
const { Schema } = mongoose;

// const cartSchema = Schema({

//     products: [
//         {
//             product: {
//                 type: Schema.Types.ObjectId,
//                 ref: "Product"
//             },
//             count: Number,
//             color: String,
//             price: Number
//         }
//     ],
//     cartTotal: Number,
//     totalAfterDiscount: Number,
//     orderBy: {
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     }

// }, {
//     timestamps: true
// });

const cartSchema = Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);