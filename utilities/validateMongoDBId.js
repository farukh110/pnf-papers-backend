const mongoose = require('mongoose');
const { Schema } = mongoose;

const validateMongoDBId = (id) => {

    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {

        throw new Error("This Id is Not valid or Not Found");
    }
}

module.exports = { validateMongoDBId };