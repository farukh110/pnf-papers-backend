const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    numViews: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisLiked: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    dislikes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    image: {
        type: String,
        default: "https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    author: {
        type: String,
        default: "Admin"
    },
    images: [],
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});

module.exports = mongoose.model("Blog", blogSchema);