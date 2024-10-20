const express = require('express');
const { createUser, loginUser, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, adminLogin, getWishList, saveUserAddress, cartUser, getUserCart, emptyUserCart, applyCoupon, createOrder, getOrders, updateOrderStatus, getAllOrders } = require('../controllers/user');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// register user
router.post('/register', createUser);

// login user
router.post('/login', loginUser);

// admin login
router.post('/admin-login', adminLogin);

// cart user
router.post('/cart', authMiddleware, cartUser);

// cart user
router.post('/cart/apply-coupon', authMiddleware, applyCoupon);

// cash order
router.post('/cart/cash-order', authMiddleware, createOrder);

// update password
router.put('/password', authMiddleware, updatePassword);

// forgot password
router.post('/forgot-password-token', forgotPasswordToken);

// reset password
router.put('/reset-password/:token', resetPassword);

// reset password
router.put('/order/update-order/:id', updateOrderStatus);

// get all users
router.get('/users', getAllUsers);

// get user orders
router.get('/orders', authMiddleware, getOrders);

// get all orders
router.get('/all-orders', authMiddleware, isAdmin, getAllOrders);

// refresh token
router.get('/refresh', handleRefreshToken);

// logout
router.get('/logout', logout);

// get wishlist
router.get('/wishlist', authMiddleware, getWishList);

// get user cart 
router.get('/cart', authMiddleware, getUserCart);

// get single user
router.get('/:id', authMiddleware, isAdmin, getUser);

// empty user cart
router.delete('/empty-cart', authMiddleware, emptyUserCart);

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