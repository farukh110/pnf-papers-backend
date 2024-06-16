const Product = require('../models/product');
const asyncHandler = require('express-async-handler');

// create product

const createProduct = asyncHandler(async (req, res) => {

    try {

        const newProduct = await Product.create(req.body);

        res.json(newProduct);

    } catch (error) {

        throw new Error(error);
    }
});

// get product

const getProduct = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        const findProduct = await Product.findById(id);

        res.json(findProduct);

    } catch (error) {

        throw new Error(error);
    }

});

module.exports = { createProduct, getProduct };