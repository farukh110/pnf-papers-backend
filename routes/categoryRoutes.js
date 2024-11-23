const express = require('express');
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories, getAllCategoryOption } = require('../controllers/category');
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

// get all category option

router.get('/options', getAllCategoryOption);

// get all categories

router.get('/', getAllCategories);

module.exports = router;
