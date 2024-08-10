const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createCountry } = require('../controllers/country');
const router = express.Router();

// create country

router.post('/', authMiddleware, isAdmin, createCountry);