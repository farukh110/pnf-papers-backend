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

// get all categories option

const getAllCategoryOption = asyncHandler(async (req, res) => {

    try {

        const categories = await Category.find();

        console.log('categories: ', categories);

        res.json(categories);

    } catch (error) {

        throw new Error(error);
    }
});

const getAllCategories = asyncHandler(async (req, res) => {

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

        const categories = await Category.find(filterCriteria)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();

        console.log('Fetched Categories:', categories);

        const totalRecords = await Category.countDocuments(filterCriteria);

        res.json({
            data: categories,
            totalRecords,
            page,
            limit,
        });


    } catch (error) {

        console.error('Error fetching categories:', error.message); // Enhanced error logging
        res.status(500).json({ message: 'Server error, please try again later.' });
    }

});

module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories, getAllCategoryOption };