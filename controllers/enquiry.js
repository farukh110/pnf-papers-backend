const Enquiry = require('../models/enquiry');
const asyncHandler = require('express-async-handler');
const { validateMongoDBId } = require('../utilities/validateMongoDBId');

// create enquiry

const createEnquiry = asyncHandler(async (req, res) => {

    try {

        const enquiryNew = await Enquiry.create(req.body);

        res.json(enquiryNew);

    } catch (error) {

        throw new Error(error);
    }
});

// update enquiry

const updateEnquiry = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const enquiry = await Enquiry.findByIdAndUpdate(id, req.body, { new: true });

        res.json(enquiry);

    } catch (error) {

        throw new Error(error);
    }

});

// delete enquiry

const deleteEnquiry = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const enquiry = await Enquiry.findByIdAndDelete(id);

        res.json(enquiry);

    } catch (error) {

        throw new Error(error);
    }

});

// get all enqueries

const getAllEnqueries = asyncHandler(async (req, res) => {

    try {

        const enqueries = await Enquiry.find();

        res.json(enqueries);

    } catch (error) {

        throw new Error(error);
    }

});

// get enquiry

const getEnquiry = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        const enquiry = await Enquiry.findById(id);

        res.json(enquiry);

    } catch (error) {

        throw new Error(error);
    }

});

module.exports = { createEnquiry, updateEnquiry, deleteEnquiry, getAllEnqueries, getEnquiry };