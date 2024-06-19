const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { validateMongoDBId } = require('../utilities/validateMongoDBId');

// create category

const createCategory = asyncHandler(async (req, res) => {

    try {

        const newCategory = await Category.create(req.body);

        res.json(newCategory);

    } catch (error) {

        throw new Error(error);
    }

});

// update category

const updateCategory = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const updateCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });

        res.json(updateCategory);

    } catch (error) {

        throw new Error(error);
    }
});

// delete category 

const deleteCategory = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const deleteCategory = await Category.findByIdAndDelete(id);

        res.json(deleteCategory);

    } catch (error) {

        throw new Error(error);
    }

});

// get category

const getCategory = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const category = await Category.findById(id);

        res.json(category);

    } catch (error) {

        throw new Error(error);
    }

});

// get all categories

const getAllCategories = asyncHandler(async (req, res) => {

    try {

        const categories = await Category.find();

        res.json(categories);

    } catch (error) {

        throw new Error(error);
    }
});

module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories };