const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBlogCategory, deleteBlogCategory, getBlogCategory, getAllBlogCategories } = require('../controllers/blogCategory');
const { updateBlog } = require('../controllers/blog');
const router = express.Router();

// create blog category 

router.post('/', authMiddleware, isAdmin, createBlogCategory);

// update blog category

router.put('/:id', authMiddleware, isAdmin, updateBlog);

// delete blog category

router.delete('/:id', authMiddleware, isAdmin, deleteBlogCategory);

// get blog category

router.get('/:id', getBlogCategory);

// get all blog categories

router.get('/', getAllBlogCategories);

module.exports = router;
