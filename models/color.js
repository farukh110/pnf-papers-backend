const mongoose = require('mongoose');
const { Schema } = mongoose;

const colorSchema = Schema({

    title: {
        type: String,
        required: true,
        unique: true,
        index: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Color", colorSchema);