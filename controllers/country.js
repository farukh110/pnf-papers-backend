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

// delete country

// get all countries

// get country

module.exports = { createCountry };
