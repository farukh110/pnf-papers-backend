const express = require('express');
const router = express.Router();
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addToWishList, productRating, uploadImages, deleteImages } = require('../controllers/product');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImageResize } = require('../middlewares/uploadImages');

// upload product images

router.put('/upload', authMiddleware, isAdmin, uploadPhoto.array("images", 10), productImageResize, uploadImages);

// delete images

router.delete('/delete-image/:id', authMiddleware, isAdmin, deleteImages);

module.exports = router;
