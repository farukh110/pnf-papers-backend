const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createCountry, updateCountry, deleteCountry, getAllCountries } = require('../controllers/country');
const router = express.Router();

// create country

router.post('/', authMiddleware, isAdmin, createCountry);

// update country

router.put('/:id', authMiddleware, isAdmin, updateCountry);

// delete country

router.delete('/:id', authMiddleware, isAdmin, deleteCountry);

// get all countries

router.get('/', getAllCountries);


