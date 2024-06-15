const express = require('express');
const { createUser, loginUser, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser } = require('../controllers/user');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// register user
router.post('/register', createUser);

// login user
router.post('/login', loginUser);

// get all users
router.get('/users', getAllUsers);

// get single user
router.get('/:id', authMiddleware, isAdmin, getUser);

// delete single user
router.delete('/:id', deleteUser);

// update single user
router.put('/edit-user', authMiddleware, updateUser);

// block user
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);

// unblock user
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;