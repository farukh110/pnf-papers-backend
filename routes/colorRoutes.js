const express = require('express');
const { createColor, updateColor, deleteColor, getAllColors, getColor, getAllColorsOption } = require('../controllers/color');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// create color

router.post('/', authMiddleware, isAdmin, createColor);

// update color

router.put('/:id', authMiddleware, isAdmin, updateColor);

// delete color

router.delete('/:id', authMiddleware, isAdmin, deleteColor);

// get all colors option

router.get('/options', getAllColorsOption);

// get all color

router.get('/', getAllColors);

// get color by id

router.get('/:id', getColor);

module.exports = router;