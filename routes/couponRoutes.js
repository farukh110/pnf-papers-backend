const express = require('express');
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, getCoupon } = require('../controllers/coupon');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// create coupon

router.post('/', authMiddleware, isAdmin, createCoupon);

// get all coupons 

router.get('/', authMiddleware, isAdmin, getAllCoupons);

// get coupon by id 

router.get('/:id', getCoupon);

// update coupon

router.put('/:id', authMiddleware, isAdmin, updateCoupon)

// delete coupon

router.delete('/:id', authMiddleware, isAdmin, deleteCoupon)

module.exports = router;