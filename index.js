const express = require('express');
const dbConnection = require('./config/dbConnection');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;

dbConnection();

app.use("/", (req, res) => {

    res.send("Pnf Papers");

});

app.listen(PORT, () => {

    console.log(`server is up and running on localhost:${PORT}`);

});

