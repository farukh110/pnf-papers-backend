const express = require('express');
const router = express.Router();
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addToWishList, productRating } = require('../controllers/product');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// create product

router.post('/', authMiddleware, isAdmin, createProduct);

// get single product

router.get('/:id', getProduct);

// wishlist product

router.put('/wishlist', authMiddleware, addToWishList);

// product rating

router.put('/rating', authMiddleware, productRating);

// update product

router.put('/:id', authMiddleware, isAdmin, updateProduct);

// delete product

router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

// get all products

router.get('/', getAllProducts);

module.exports = router;
