const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createCountry, updateCountry } = require('../controllers/country');
const router = express.Router();

// create country

router.post('/', authMiddleware, isAdmin, createCountry);

// update country

router.put('/:id', authMiddleware, isAdmin, updateCountry);
