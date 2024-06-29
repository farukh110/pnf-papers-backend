const Color = require('../models/color');
const asyncHandler = require('express-async-handler');
const { validateMongoDBId } = require('../utilities/validateMongoDBId');

// create color

const createColor = asyncHandler(async (req, res) => {

    try {

        const newColor = await Color.create(req.body);

        res.json(newColor);

    } catch (error) {

        throw new Error(error);
    }

});

// update color

const updateColor = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const updateColor = await Color.findByIdAndUpdate(id, req.body, { new: true });

        res.json(updateColor);

    } catch (error) {

        throw new Error(error);
    }
});

// delete color

const deleteColor = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const deleteColor = await Color.findByIdAndDelete(id);

        res.json(deleteColor);

    } catch (error) {

        throw new Error(error);
    }
});

// get all colors

const getAllColors = asyncHandler(async (req, res) => {

    try {

        const colors = await Color.find();

        res.json(colors);

    } catch (error) {

        throw new Error(error);
    }
});

// get color

const getColor = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const color = await Color.findById(id);

        res.json(color);

    } catch (error) {

        throw new Error(error);
    }
});

module.exports = { createColor, updateColor, deleteColor, getAllColors, getColor };
