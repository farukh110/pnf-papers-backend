const mongoose = require('mongoose');
const { Schema } = mongoose;

const countrySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Country', countrySchema);
