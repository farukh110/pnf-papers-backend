const express = require('express');
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories } = require('../controllers/category');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// create category 

router.post('/', authMiddleware, isAdmin, createCategory);

// update category

router.put('/:id', authMiddleware, isAdmin, updateCategory);

// delete category

router.delete('/:id', authMiddleware, isAdmin, deleteCategory);

// get category

router.get('/:id', getCategory);

// get all categories

router.get('/', getAllCategories);

module.exports = router;
