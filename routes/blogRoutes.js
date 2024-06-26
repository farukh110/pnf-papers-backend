const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, disLikedBlog, uploadImages } = require('../controllers/blog');
const { uploadPhoto, blogImageResize } = require('../middlewares/uploadImages');
const router = express.Router();

// create blog

router.post('/', authMiddleware, isAdmin, createBlog)

// upload blog images

router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array("images", 2), blogImageResize, uploadImages);

// like blog

router.put('/likes', authMiddleware, likeBlog)

// dislike blog

router.put('/dislikes', authMiddleware, disLikedBlog)

// update blog

router.put('/:id', authMiddleware, isAdmin, updateBlog)

// get blog

router.get('/:id', getBlog)

// get all blogs

router.get('/', getAllBlogs)

// delete blog

router.delete('/:id', authMiddleware, isAdmin, deleteBlog)

module.exports = router;