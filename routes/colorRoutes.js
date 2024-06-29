const express = require('express');
const { createColor, updateColor, deleteColor, getAllColors, getColor } = require('../controllers/color');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// create color

router.post('/', authMiddleware, isAdmin, createColor);

// update color

router.put('/:id', authMiddleware, isAdmin, updateColor);

// delete color

router.delete('/:id', authMiddleware, isAdmin, deleteColor);

// get all color

router.get('/', getAllColors);

// get color by id

router.get('/:id', getColor);

module.exports = router;