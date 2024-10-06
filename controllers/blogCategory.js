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

        console.log('Received ID:', id);

        validateMongoDBId(id);

        // Check if the document exists
        const existingCategory = await BlogCategory.findById(id);
        if (!existingCategory) {
            res.status(404).json({ message: 'Blog Category not found' });
            return;
        }

        const updatedBlogCategory = await BlogCategory.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true } // Ensure new document is returned and validators are run
        );

        // If the update operation failed
        if (!updatedBlogCategory) {
            res.status(500).json({ message: 'Failed to update Blog Category' });
            return;
        }

        res.json(updatedBlogCategory);
    } catch (error) {
        console.error('Error updating blog category:', error);
        res.status(500).json({ message: error.message });
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

// const getAllBlogCategories = asyncHandler(async (req, res) => {

//     try {

//         const blogCategories = await BlogCategory.find();

//         res.json(blogCategories);

//     } catch (error) {

//         throw new Error(error);
//     }
// });

const getAllBlogCategories = asyncHandler(async (req, res) => {

    try {

        const page = Math.max(1, parseInt(req.query.page, 10)) || 1;
        const limit = Math.max(1, parseInt(req.query.limit, 10)) || 50;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const filters = req.query.filters ? decodeURIComponent(req.query.filters) : '{}';
        let parsedFilters = {};
        try {
            parsedFilters = JSON.parse(filters);
        } catch (e) {
            return res.status(400).json({ message: 'Invalid filters format' });
        }

        console.log('Filters Parameter:', req.query.filters);
        console.log('Decoded Filters:', filters);
        console.log('Parsed Filters Object:', parsedFilters);

        const skip = (page - 1) * limit;

        const filterCriteria = {};

        for (const key in parsedFilters) {
            if (Object.hasOwnProperty.call(parsedFilters, key)) {
                const { value, matchMode } = parsedFilters[key];

                if (value !== null && value !== '') {
                    switch (matchMode) {
                        case 'startsWith':
                            filterCriteria[key] = { $regex: `^${value}`, $options: 'i' };
                            break;
                        case 'contains':
                            filterCriteria[key] = { $regex: value, $options: 'i' };
                            break;
                        case 'equals':
                            filterCriteria[key] = value;
                            break;
                        case 'notEquals':
                            filterCriteria[key] = { $ne: value };
                            break;
                        case 'endsWith':
                            filterCriteria[key] = { $regex: `${value}$`, $options: 'i' };
                            break;
                        default:
                            console.warn(`Unsupported matchMode: ${matchMode}`);
                            break;
                    }
                }
            }
        }

        console.log('Filter Criteria Object:', filterCriteria);

        const blogsCategory = await BlogCategory.find(filterCriteria)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();

        console.log('Fetched Blogs Category:', blogsCategory);

        const totalRecords = await BlogCategory.countDocuments(filterCriteria);

        res.json({
            data: blogsCategory,
            totalRecords,
            page,
            limit,
        });


    } catch (error) {

        console.error('Error fetching blogs category:', error.message); // Enhanced error logging
        res.status(500).json({ message: 'Server error, please try again later.' });
    }

});

module.exports = { createBlogCategory, updateBlogCategory, deleteBlogCategory, getBlogCategory, getAllBlogCategories };