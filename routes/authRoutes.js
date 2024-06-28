const express = require('express');
const { createUser, loginUser, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, adminLogin, getWishList, saveUserAddress } = require('../controllers/user');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// register user
router.post('/register', createUser);

// login user
router.post('/login', loginUser);

// admin login
router.post('/admin-login', adminLogin);

// update password
router.put('/password', authMiddleware, updatePassword);

// forgot password
router.post('/forgot-password-token', forgotPasswordToken);

// reset password
router.put('/reset-password/:token', resetPassword);

// get all users
router.get('/users', getAllUsers);

// refresh token
router.get('/refresh', handleRefreshToken);

// logout
router.get('/logout', logout);

// get wishlist
router.get('/wishlist', authMiddleware, getWishList);

// get single user
router.get('/:id', authMiddleware, isAdmin, getUser);

// delete single user
router.delete('/:id', deleteUser);

// update single user
router.put('/edit-user', authMiddleware, updateUser);

// save address
router.put('/save-address', authMiddleware, saveUserAddress);

// block user
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);

// unblock user
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;