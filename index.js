const express = require('express');
const bodyParser = require('body-parser');
const dbConnection = require('./config/dbConnection');
const app = express();
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;
const morgan = require('morgan');

const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const blogRouter = require('./routes/blogRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const blogCategoryRouter = require('./routes/blogCategoryRoutes');

const { notFound, errorHandler } = require('./middlewares/errorHandler');

dbConnection();

// app.use("/", (req, res) => {

//     res.send("Pnf Papers");

// });

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blog-category', blogCategoryRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {

    console.log(`server is up and running on localhost:${PORT}`);

});

