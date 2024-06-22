const Brand = require('../models/brand');
const asyncHandler = require('express-async-handler');
const { validateMongoDBId } = require('../utilities/validateMongoDBId');

// create brand

const createBrand = asyncHandler(async (req, res) => {

    try {

        const newBrand = await Brand.create(req.body);

        res.json(newBrand);

    } catch (error) {

        throw new Error(error);
    }

});

// update brand

const updateBrand = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });

        res.json(updateBrand);

    } catch (error) {

        throw new Error(error);
    }
});

// delete brand

const deleteBrand = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const deleteBrand = await Brand.findByIdAndDelete(id);

        res.json(deleteBrand);

    } catch (error) {

        throw new Error(error);
    }
})

// get all brands

const getAllBrands = asyncHandler(async (req, res) => {

    try {

        const brands = await Brand.find();

        res.json(brands);

    } catch (error) {

        throw new Error(error);
    }

});

// get brand

const getBrand = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const brand = await Brand.findById(id);

        res.json(brand);

    } catch (error) {

        throw new Error(error);
    }

});

module.exports = { createBrand, updateBrand, deleteBrand, getAllBrands, getBrand };