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

const getAllCoupons = asyncHandler(async (req, res) => {

    try {

        const coupons = await Coupon.find();

        res.json(coupons);

    } catch (error) {

        throw new Error(error);

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