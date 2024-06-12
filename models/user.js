const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = Schema({

    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: false,
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }

});

module.exports = mongoose.model('User', userSchema);