const express = require('express');
const router = express.Router();
const { createProduct, getProduct } = require('../controllers/product');

// create product

router.post('/', createProduct);

// get single product

router.get('/:id', getProduct);

module.exports = router;
