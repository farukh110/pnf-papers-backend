const Enquiry = require('../models/enquiry');
const asyncHandler = require('express-async-handler');
const { validateMongoDBId } = require('../utilities/validateMongoDBId');

// create enquiry

const createEnquiry = asyncHandler(async (req, res) => {

    try {

        const enquiryNew = await Enquiry.create(req.body);

        res.json(enquiryNew);

    } catch (error) {

        throw new Error(error);
    }
});

// update enquiry

const updateEnquiry = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const enquiry = await Enquiry.findByIdAndUpdate(id, req.body, { new: true });

        res.json(enquiry);

    } catch (error) {

        throw new Error(error);
    }

});

// delete enquiry

const deleteEnquiry = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const enquiry = await Enquiry.findByIdAndDelete(id);

        res.json(enquiry);

    } catch (error) {

        throw new Error(error);
    }

});

// get all enqueries

// const getAllEnquiries = asyncHandler(async (req, res) => {

//     try {

//         const enqueries = await Enquiry.find();

//         res.json(enqueries);

//     } catch (error) {

//         throw new Error(error);
//     }

// });

const getAllEnquiries = asyncHandler(async (req, res) => {

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

        const enquiry = await Enquiry.find(filterCriteria)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();

        console.log('Fetched Enquiry:', enquiry);

        const totalRecords = await Enquiry.countDocuments(filterCriteria);

        res.json({
            data: enquiry,
            totalRecords,
            page,
            limit,
        });


    } catch (error) {

        console.error('Error fetching Enquiry:', error.message); // Enhanced error logging
        res.status(500).json({ message: 'Server error, please try again later.' });
    }

});

// get enquiry

const getEnquiry = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        const enquiry = await Enquiry.findById(id);

        res.json(enquiry);

    } catch (error) {

        throw new Error(error);
    }

});

module.exports = { createEnquiry, updateEnquiry, deleteEnquiry, getAllEnquiries, getEnquiry };