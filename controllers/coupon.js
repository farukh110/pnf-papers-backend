const Coupon = require('../models/coupon');
const asyncHandler = require('express-async-handler');
const { validateMongoDBId } = require('../utilities/validateMongoDBId');

// create coupon

const createCoupon = asyncHandler(async (req, res) => {

    try {

        const newCoupon = await Coupon.create(req.body);

        res.json(newCoupon);

    } catch (error) {

        throw new Error(error);
    }

});

// get all coupons

// const getAllCoupons = asyncHandler(async (req, res) => {

//     try {

//         const coupons = await Coupon.find();

//         res.json(coupons);

//     } catch (error) {

//         throw new Error(error);

//     }

// });

const getAllCoupons = asyncHandler(async (req, res) => {

    try {

        const page = Math.max(1, parseInt(req.query.page, 10)) || 1;
        const limit = Math.max(1, parseInt(req.query.limit, 10)) || 50;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? -1 : 1;

        const filters = req.query.filters ? decodeURIComponent(req.query.filters) : '{}';

        let parsedFilters = {};

        try {

            parsedFilters = JSON.parse(filters);

        } catch (error) {

            return res.status(400).json({ message: 'Invalid filters format' });
        }

        console.log('Filters Parameters:', req.query.filters);
        console.log('Decode Filters:', filters);
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

        const coupons = await Coupon.find(filterCriteria)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();

        console.log('Fetched Coupons:', coupons);

        const totalRecords = await Coupon.countDocuments(filterCriteria);

        res.json({
            data: coupons,
            totalRecords,
            page,
            limit
        })

    } catch (error) {

        console.error('Error fetching coupons:', error.message); // Enhanced error logging
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

// get coupon by id

const getCoupon = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        const coupon = await Coupon.findById(id);

        res.json(coupon);

    } catch (error) {

        throw new Error(error);
    }
});

// update coupon

const updateCoupon = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });

        res.json(coupon);

    } catch (error) {

        throw new Error(error);
    }
});

// delete coupon

const deleteCoupon = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const coupon = await Coupon.findByIdAndDelete(id);

        res.json(coupon);

    } catch (error) {

        throw new Error(error);
    }

});

module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, getCoupon };