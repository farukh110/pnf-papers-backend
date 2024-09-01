const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createCity, updateCity, deleteCity, getAllCities, getCity } = require('../controllers/city');
const router = express.Router();

// create city

router.post('/', authMiddleware, isAdmin, createCity);

// update city

router.put('/:id', authMiddleware, isAdmin, updateCity);

// delete city

router.delete('/:id', authMiddleware, isAdmin, deleteCity);

// get all cities

router.get('/', getAllCities);

// get city by id

router.get('/:id', getCity);

module.exports = router;

