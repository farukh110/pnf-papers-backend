const Color = require('../models/color');
const asyncHandler = require('express-async-handler');
const { validateMongoDBId } = require('../utilities/validateMongoDBId');

// create color

const createColor = asyncHandler(async (req, res) => {

    try {

        const newColor = await Color.create(req.body);

        res.json(newColor);

    } catch (error) {

        throw new Error(error);
    }

});

// update color

const updateColor = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const updateColor = await Color.findByIdAndUpdate(id, req.body, { new: true });

        res.json(updateColor);

    } catch (error) {

        throw new Error(error);
    }
});

// delete color

const deleteColor = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const deleteColor = await Color.findByIdAndDelete(id);

        res.json(deleteColor);

    } catch (error) {

        throw new Error(error);
    }
});

// get all colors

const getAllColorsOption = asyncHandler(async (req, res) => {

    try {

        const colors = await Color.find();

        res.json(colors);

    } catch (error) {

        throw new Error(error);
    }
});

const getAllColors = asyncHandler(async (req, res) => {

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

        const colors = await Color.find(filterCriteria)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();

        console.log('Fetched Colors:', colors);

        const totalRecords = await Color.countDocuments(filterCriteria);

        res.json({
            data: colors,
            totalRecords,
            page,
            limit,
        });


    } catch (error) {

        console.error('Error fetching colors:', error.message); // Enhanced error logging
        res.status(500).json({ message: 'Server error, please try again later.' });
    }

});

// get color

const getColor = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const color = await Color.findById(id);

        res.json(color);

    } catch (error) {

        throw new Error(error);
    }
});

module.exports = { createColor, updateColor, deleteColor, getAllColors, getColor, getAllColorsOption };
