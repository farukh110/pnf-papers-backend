const express = require('express');
const router = express.Router();
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addToWishList, productRating, uploadImages } = require('../controllers/product');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImageResize } = require('../middlewares/uploadImages');

// create product

router.post('/', authMiddleware, isAdmin, createProduct);

// upload product images

router.put('/upload', authMiddleware, isAdmin, uploadPhoto.array("images", 10), productImageResize, uploadImages);

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
