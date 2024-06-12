const { default: mongoose } = require("mongoose");

const dbConnection = () => {

    try {

        const connect = mongoose.connect(process.env.MONGODB_URL);

        console.log('Database connected', connect);

    } catch (error) {

        // throw new Error(error);
        console.log('Error: ', error);
    }

};

module.exports = dbConnection;