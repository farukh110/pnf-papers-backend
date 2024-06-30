const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createEnquiry, updateEnquiry, deleteEnquiry, getAllEnquiries, getEnquiry } = require('../controllers/enquiry');
const router = express.Router();

// create enquiry

router.post('/', createEnquiry);

// update enquiry

router.put('/:id', authMiddleware, isAdmin, updateEnquiry);

// delete enquiry

router.delete('/:id', authMiddleware, isAdmin, deleteEnquiry);

// get all enqueries

router.get('/', getAllEnquiries);

// get enquiry by id

router.get('/:id', getEnquiry);

module.exports = router;