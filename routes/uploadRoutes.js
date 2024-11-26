const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImageResize } = require('../middlewares/uploadImages');
const { uploadImages, deleteImages } = require('../controllers/upload');

// upload product images

router.put('/upload', authMiddleware, isAdmin, uploadPhoto.array("images", 10), productImageResize, uploadImages);

// delete images

router.delete('/delete-image/:id', authMiddleware, isAdmin, deleteImages);

module.exports = router;
