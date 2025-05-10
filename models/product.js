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
    // category: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Category"
    // },
    category: {
        type: String,
        required: true
    },
    // brand: {
    //     type: String,
    //     enum: ["Venial Paper", "Frosted Paper", "Panaflex Paper"]
    // },
    brand: {
        type: String,
        required: true
    },
    sold: {
        type: Number,
        default: 0,
        // select: false
    },
    quantity: {
        type: Number,
        required: true,
        // select: false
    },
    images: [
        {
            public_id: String,
            url: String
        }
    ],
    // color: {
    //     type: String,
    //     enum: ["#A3A3A5", "#C1C1C3", "#787578"]
    // },
    // color: {
    //     type: String,
    //     required: true
    // },
    color: [],
    // color: [{ type: Schema.Types.ObjectId, ref: "Color" }],
    // tags: [],
    tags: String,
    ratings: [
        {
            star: Number,
            comment: String,
            postedBy: { type: Schema.Types.ObjectId, ref: "User" }
        }
    ],
    totalRating: {
        type: String,
        default: 0
    },
    length: {
        type: Number,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);