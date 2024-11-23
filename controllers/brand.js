const Brand = require('../models/brand');
const asyncHandler = require('express-async-handler');
const { validateMongoDBId } = require('../utilities/validateMongoDBId');

// create brand

const createBrand = asyncHandler(async (req, res) => {

    try {

        const newBrand = await Brand.create(req.body);

        res.json(newBrand);

    } catch (error) {

        throw new Error(error);
    }

});

// update brand

const updateBrand = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });

        res.json(updateBrand);

    } catch (error) {

        throw new Error(error);
    }
});

// delete brand

const deleteBrand = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const deleteBrand = await Brand.findByIdAndDelete(id);

        res.json(deleteBrand);

    } catch (error) {

        throw new Error(error);
    }
})

// get all brands option

const getAllBrandsOption = asyncHandler(async (req, res) => {

    try {

        const brands = await Brand.find();

        res.json(brands);

    } catch (error) {

        throw new Error(error);
    }

});

const getAllBrands = asyncHandler(async (req, res) => {

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

        const brands = await Brand.find(filterCriteria)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();

        console.log('Fetched Brands:', brands);

        const totalRecords = await Brand.countDocuments(filterCriteria);

        res.json({
            data: brands,
            totalRecords,
            page,
            limit,
        });


    } catch (error) {

        console.error('Error fetching brands:', error.message); // Enhanced error logging
        res.status(500).json({ message: 'Server error, please try again later.' });
    }

});

// get brand

const getBrand = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const brand = await Brand.findById(id);

        res.json(brand);

    } catch (error) {

        throw new Error(error);
    }

});

module.exports = { createBrand, updateBrand, deleteBrand, getAllBrands, getBrand, getAllBrandsOption };