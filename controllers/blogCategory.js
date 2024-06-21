const BlogCategory = require('../models/blogCategory');
const asyncHandler = require('express-async-handler');
const { validateMongoDBId } = require('../utilities/validateMongoDBId');

// create blog category

const createBlogCategory = asyncHandler(async (req, res) => {

    try {

        const newBlogCategory = await BlogCategory.create(req.body);

        res.json(newBlogCategory);

    } catch (error) {

        throw new Error(error);
    }

});

// update blog category

const updateBlogCategory = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const updateBlogCategory = await BlogCategory.findByIdAndUpdate(id, req.body, { new: true });

        res.json(updateBlogCategory);

    } catch (error) {

        throw new Error(error);
    }
});

// delete blog category 

const deleteBlogCategory = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const deleteBlogCategory = await BlogCategory.findByIdAndDelete(id);

        res.json(deleteBlogCategory);

    } catch (error) {

        throw new Error(error);
    }

});

// get blog category

const getBlogCategory = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const blogCategory = await BlogCategory.findById(id);

        res.json(blogCategory);

    } catch (error) {

        throw new Error(error);
    }

});

// get all blog categories

const getAllBlogCategories = asyncHandler(async (req, res) => {

    try {

        const blogCategories = await BlogCategory.find();

        res.json(blogCategories);

    } catch (error) {

        throw new Error(error);
    }
});

module.exports = { createBlogCategory, updateBlogCategory, deleteBlogCategory, getBlogCategory, getAllBlogCategories };