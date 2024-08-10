const Country = require('../models/country');
const asyncHandler = require('express-async-handler');

// create country

const createCountry = asyncHandler(async (req, res) => {

    try {

        const newCountry = await Country.create(req.body);

        res.json(newCountry);

    } catch (error) {

        throw new Error(error);
    }

});

// update country

const updateCountry = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const updateCountry = await Country.findByIdAndUpdate(id, req.body, { new: true });

        res.json(updateCountry);

    } catch (error) {

        throw new Error(error);
    }
});

// delete country

const deleteCountry = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const country = await Country.findByIdAndDelete(id);

        res.json(country);

    } catch (error) {

        throw new Error(error);
    }

});

// get all countries

// get country

module.exports = { createCountry, updateCountry, deleteCountry };
