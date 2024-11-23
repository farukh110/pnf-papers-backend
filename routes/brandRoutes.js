const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBrand, updateBrand, deleteBrand, getAllBrands, getBrand, getAllBrandsOption } = require('../controllers/brand');
const router = express.Router();

// create brand

router.post('/', authMiddleware, isAdmin, createBrand);

// update brand

router.put('/:id', authMiddleware, isAdmin, updateBrand);

// delete brand

router.delete('/:id', authMiddleware, isAdmin, deleteBrand);

// get all brands option

router.get('/options', getAllBrandsOption);


// get all brands

router.get('/', getAllBrands);

// get brand by id

router.get('/:id', getBrand);

module.exports = router;