const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    brand: {
        type: String,
        enum: ["Venial Paper", "Frosted Paper", "Panaflex Paper"]
    },
    sold: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        required: true
    },
    images: {
        type: Array
    },
    color: {
        type: String,
        enum: ["#A3A3A5", "#C1C1C3", "#787578"]
    },
    ratings: [
        {
            star: Number,
            postedBy: { type: Schema.Types.ObjectId, ref: "User" }
        }
    ]

}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);