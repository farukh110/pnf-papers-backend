const express = require('express');
const bodyParser = require('body-parser');
const dbConnection = require('./config/dbConnection');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;

const authRouter = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

dbConnection();

// app.use("/", (req, res) => {

//     res.send("Pnf Papers");

// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/user', authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {

    console.log(`server is up and running on localhost:${PORT}`);

});

