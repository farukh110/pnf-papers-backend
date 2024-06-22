const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBlogCategory, deleteBlogCategory, getBlogCategory, getAllBlogCategories, updateBlogCategory } = require('../controllers/blogCategory');
const router = express.Router();

// create blog category 

router.post('/', authMiddleware, isAdmin, createBlogCategory);

// update blog category

router.put('/:id', authMiddleware, isAdmin, updateBlogCategory);

// delete blog category

router.delete('/:id', authMiddleware, isAdmin, deleteBlogCategory);

// get blog category

router.get('/:id', getBlogCategory);

// get all blog categories

router.get('/', getAllBlogCategories);

module.exports = router;
