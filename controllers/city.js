const City = require('../models/City');
const asyncHandler = require('express-async-handler');

// create City

const createCity = asyncHandler(async (req, res) => {

    try {

        const newCity = await City.create(req.body);

        res.json(newCity);

    } catch (error) {

        throw new Error(error);
    }

});

// update City

const updateCity = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const updateCity = await City.findByIdAndUpdate(id, req.body, { new: true });

        res.json(updateCity);

    } catch (error) {

        throw new Error(error);
    }
});

// delete City

const deleteCity = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const City = await City.findByIdAndDelete(id);

        res.json(City);

    } catch (error) {

        throw new Error(error);
    }

});

// get all cities

const getAllCities = asyncHandler(async (req, res) => {

    try {

        const cities = await City.find();

        res.json(cities);

    } catch (error) {

        throw new Error(error);
    }
});

// get City

const getCity = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const City = await City.findById(id);

        res.json(City);

    } catch (error) {

        throw new Error(error);
    }
});

module.exports = { createCity, updateCity, deleteCity, getAllCities, getCity };
