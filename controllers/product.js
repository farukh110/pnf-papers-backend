const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

// create product

const createProduct = asyncHandler(async (req, res) => {

    try {

        if (req.body.title) {

            req.body.slug = slugify(req.body.title);
        }

        const newProduct = await Product.create(req.body);

        res.json(newProduct);

    } catch (error) {

        throw new Error(error);
    }
});

// update product

const updateProduct = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const updateProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        res.json(updateProduct);

    } catch (error) {

        throw new Error(error);

    }

});

// delete product

const deleteProduct = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        const deleteProduct = await Product.findByIdAndDelete(id);

        res.json(deleteProduct);

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

// get all products

const getAllProducts = asyncHandler(async (req, res) => {

    try {

        console.log('req.query: ', req.query);

        // const allProducts = await Product.find(req.query);

        // const allProducts = await Product.find({
        //     brand: req.query.brand,
        //     category: req.query.category
        // });

        const queryObj = { ...req.query };

        const excludeFields = ["page", "sort", "limit", "fields"];

        excludeFields.forEach((el) => delete queryObj[el]);

        console.log('query obj: ', queryObj, excludeFields);

        // const allProducts = await Product.where("category").equals(
        //     req.query.category
        // );

        console.log('queryObj ---------> ', queryObj);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        // console.log('queryStr: ', JSON.parse(queryStr));

        let query = Product.find(JSON.parse(queryStr));

        // const allProducts = await Product.find(queryObj);

        // sorting

        if (req.query.sort) {

            const sortBy = req.query.sort.split(",").join(" ");

            query = query.sort(sortBy);

        } else {

            query = query.sort("-createdAt");

        }

        // limiting the fields

        if (req.query.fields) {

            const fields = req.query.fields.split(",").join(" ");

            query = query.select(fields);

        } else {

            query = query.select('-__v');

        }

        // pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page) {

            const productCount = await Product.countDocuments();

            if (skip >= productCount) {

                throw new Error("This Page does not exists");
            }
        }

        console.log(page, limit, skip);

        const product = await query;

        res.json(product);

    } catch (error) {

        throw new Error(error);
    }
});

module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct };