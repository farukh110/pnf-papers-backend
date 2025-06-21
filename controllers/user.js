const { generateToken } = require('../config/jwtToken');
const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const Coupon = require('../models/coupon');
const uniqid = require('uniqid');
const asyncHandler = require('express-async-handler');
const { validateMongoDBId } = require('../utilities/validateMongoDBId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./email');
const crypto = require('crypto');

// create new user

const createUser = asyncHandler(async (req, res) => {

    const email = req.body.email;

    const findUser = await User.findOne({ email: email });

    if (!findUser) {

        const newUser = await User.create(req.body);
        res.json(newUser);

    } else {

        // res.json({
        //     message: "User Already Exists",
        //     success: false
        // });
        throw new Error("User Already Exists");
    }
});

// login user

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    console.log(`email: ${email}, password: ${password}`);

    const findUser = await User.findOne({ email });

    if (findUser && await findUser.isPasswordMatched(password)) {

        const refreshToken = await generateRefreshToken(findUser?._id);

        const updateUser = await User.findByIdAndUpdate(

            findUser?.id,
            {
                refreshToken: refreshToken
            },
            { new: true }
        );

        res.cookie("refreshToken", refreshToken, {

            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000

        });

        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });

    } else {

        throw new Error("Invalid Credentials");
    }

});

// admin login

const adminLogin = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    console.log(`email: ${email}, password: ${password}`);

    const admin = await User.findOne({ email });

    if (admin.role !== "admin") throw new Error("Not Authorized User");

    if (admin && await admin.isPasswordMatched(password)) {

        const refreshToken = await generateRefreshToken(admin?._id);

        const updateAdmin = await User.findByIdAndUpdate(

            admin?.id,
            {
                refreshToken: refreshToken
            },
            { new: true }
        );

        res.cookie("refreshToken", refreshToken, {

            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000

        });

        res.json({
            _id: admin?._id,
            firstname: admin?.firstname,
            lastname: admin?.lastname,
            email: admin?.email,
            mobile: admin?.mobile,
            token: generateToken(admin?._id)
        });

    } else {

        throw new Error("Invalid Credentials");
    }

});

// refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {

    const cookie = req.cookies;

    console.log('cookie: ', cookie);

    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");

    const refreshToken = cookie.refreshToken;

    console.log('refreshToken: ', refreshToken);

    const user = await User.findOne({ refreshToken });

    if (!user) throw new Error("No Refresh token is Available in Database or not matched");

    // res.json(user);

    jwt.verify(refreshToken, process.env.JWT_SECRET, (error, decoded) => {

        console.log('decoded', decoded);

        if (error || user.id !== decoded.id) {

            throw new Error("There is something went wrong with Refresh Token");
        }

        const accessToken = generateToken(user?._id);

        res.json({ accessToken });

    });

});

// logout functionality

const logout = asyncHandler(async (req, res) => {

    const cookie = req.cookies;

    console.log('cookie: ', cookie);

    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");

    const refreshToken = cookie.refreshToken;

    const user = await User.findOne({ refreshToken });

    if (!user) {
        res.clearCookie("refreshToken",
            {
                httpOnly: true,
                secure: true
            }
        );
        // forbidden
        return res.sendStatus(204);
    }

    await User.findOneAndUpdate({ refreshToken }, {
        refreshToken: ""
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    });

    res.sendStatus(204);

});

// get all users

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        // Extract and validate query parameters
        const page = Math.max(1, parseInt(req.query.page, 10)) || 1; // Ensure page is at least 1
        const limit = Math.max(1, parseInt(req.query.limit, 10)) || 50; // Ensure limit is at least 1
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        // Decode and parse filters
        const filters = req.query.filters ? decodeURIComponent(req.query.filters) : '{}';
        let parsedFilters = {};
        try {
            parsedFilters = JSON.parse(filters);
        } catch (e) {
            return res.status(400).json({ message: 'Invalid filters format' });
        }

        console.log('Filters Parameter:', req.query.filters);
        console.log('Decoded Filters:', filters);
        console.log('Parsed Filters Object:', parsedFilters);

        const skip = (page - 1) * limit;

        // Initialize filter criteria
        const filterCriteria = {};

        for (const key in parsedFilters) {
            if (Object.hasOwnProperty.call(parsedFilters, key)) {
                const { value, matchMode } = parsedFilters[key];

                if (value !== null && value !== '') {
                    switch (matchMode) {
                        case 'startsWith':
                            filterCriteria[key] = { $regex: `^${value}`, $options: 'i' };
                            break;
                        case 'contains':
                            filterCriteria[key] = { $regex: value, $options: 'i' };
                            break;
                        case 'equals':
                            filterCriteria[key] = value;
                            break;
                        case 'notEquals':
                            filterCriteria[key] = { $ne: value };
                            break;
                        case 'endsWith':
                            filterCriteria[key] = { $regex: `${value}$`, $options: 'i' };
                            break;
                        default:
                            console.warn(`Unsupported matchMode: ${matchMode}`);
                            break;
                    }
                }
            }
        }

        console.log('Filter Criteria Object:', filterCriteria);

        // Fetch users with applied filters, sorting, and pagination
        const users = await User.find(filterCriteria)
            .select('-password -refreshToken')  // Exclude sensitive fields
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean(); // Convert Mongoose documents to plain JavaScript objects

        console.log('Fetched Users:', users);

        // Get the total number of records matching the filters
        const totalRecords = await User.countDocuments(filterCriteria);

        // Respond with the users data, total records, current page, and limit
        res.json({
            data: users,
            totalRecords,
            page,
            limit,
        });

    } catch (error) {
        console.error('Error fetching users:', error.message); // Enhanced error logging
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

// get single user

const getUser = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;
        // console.log('user id: ', id);

        validateMongoDBId(id);

        const user = await User.findById(id);
        res.json({
            user
        });

    } catch (error) {

        throw new Error(error);
    }

});

// delete single user

const deleteUser = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const user = await User.findByIdAndDelete(id);

        res.json({
            user
        });

    } catch (error) {

        throw new Error(error);
    }
});

// update single user

const updateUser = asyncHandler(async (req, res) => {

    try {

        console.log('user detail: ', req.user);
        const { _id } = req.user;

        validateMongoDBId(_id);

        const updateUser = await User.findByIdAndUpdate(_id, {

            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, {
            new: true
        });

        res.json(updateUser);

    } catch (error) {

        throw new Error(error);

    }

});

// block user

const blockUser = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true
            },
            {
                new: true
            }
        )

        res.json({
            message: "User Blocked"
        })

    } catch (error) {

        throw new Error(error);
    }

});

// unblock user

const unblockUser = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const unblock = await User.findByIdAndUpdate(

            id,
            {
                isBlocked: false
            },
            {
                new: true
            }
        );

        res.json({
            message: "User Unblocked"
        })

    } catch (error) {

        throw new Error(error);
    }
});

// update password

const updatePassword = asyncHandler(async (req, res) => {

    try {

        const { _id } = req.user;
        const { password } = req.body;

        validateMongoDBId(_id);

        const user = await User.findById(_id);

        if (password) {

            user.password = password;
            const updatedPassword = await user.save();
            res.json(updatedPassword);

        } else {

            res.json(user);
        }

    } catch (error) {

        throw new Error(error);
    }

});

// forgot password

const forgotPasswordToken = asyncHandler(async (req, res) => {

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new Error("User not found with this email");

    try {

        const token = await user.createPasswordResetToken();

        if (Array.isArray(user.address)) {
            user.address = '';
        }

        await user.save();

        const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. 
        <a href='http://localhost:5173/reset-password/${token}'> click here </a>`;

        const data = {

            to: email,
            text: "Hi User",
            subject: "Forgot Password Link",
            html: resetURL
        };

        sendEmail(data);

        res.json(token);

    } catch (error) {

        throw new Error(error);
    }

});

// reset password

const resetPassword = asyncHandler(async (req, res) => {

    const { password } = req.body;
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({

        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }

    });

    if (!user) throw new Error("Token Expired, Please try again later.");

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    res.json(user);

});

// get wish list

const getWishList = asyncHandler(async (req, res) => {

    try {

        const { _id } = req.user;

        const user = await User.findById(_id).populate("wishlist");

        res.json(user);

    } catch (error) {

        throw new Error(error);
    }

});

// save address

const saveUserAddress = asyncHandler(async (req, res) => {

    try {

        const { _id } = req.user;
        validateMongoDBId(_id);

        const updateAddress = await User.findByIdAndUpdate(_id, {

            address: req?.body?.address,

        }, {
            new: true
        });

        res.json(updateAddress);


    } catch (error) {

        throw new Error(error);
    }

});

// add to cart

// const cartUser = asyncHandler(async (req, res) => {

//     try {

//         const { cart } = req.body;
//         const { _id } = req.user;

//         validateMongoDBId(_id);

//         const user = await User.findById(_id);

//         const products = [];

//         const alreadyExistsCart = await Cart.findOne({ orderBy: user._id });

//         if (alreadyExistsCart) {
//             alreadyExistsCart.remove();
//         }

//         for (let i = 0; i < cart.length; i++) {

//             let object = {};

//             object.product = cart[i]._id;
//             object.count = cart[i].count;
//             object.color = cart[i].color;

//             let getPrice = await Product.findById(cart[i]._id).select("price").exec();
//             object.price = getPrice.price;

//             products.push(object);

//         }

//         let cartTotal = 0;

//         for (let i = 0; i < products.length; i++) {

//             cartTotal = cartTotal + products[i].price * products[i].count;

//         }

//         console.log('products: ', products);

//         console.log(products, cartTotal);

//         let newCartItem = await new Cart({

//             products,
//             cartTotal,
//             orderBy: user?._id

//         }).save();

//         res.json(newCartItem);

//     } catch (error) {

//         throw new Error(error);
//     }

// });

const cartUser = asyncHandler(async (req, res) => {

    try {

        const { productId, color, quantity, price } = req.body;
        const { _id } = req.user;

        validateMongoDBId(_id);

        let newCartItem = await new Cart({

            userId: _id,
            productId,
            color,
            price,
            quantity

        }).save();

        res.json(newCartItem);

    } catch (error) {

        throw new Error(error);
    }

});

// get user cart

const getUserCart = asyncHandler(async (req, res) => {

    try {

        const { _id } = req.user;
        validateMongoDBId(_id);

        const cart = await Cart.find({ userId: _id }).populate("productId").populate("color");

        res.json(cart);

    } catch (error) {

        throw new Error(error);
    }

});

// remove product from cart

const removeProductFromCart = asyncHandler(async (req, res) => {

    try {

        const { _id } = req.user;
        const { cartItemId } = req.params;
        validateMongoDBId(_id);

        const deleteProduct = await Cart.deleteOne({ userId: _id, _id: cartItemId });

        res.json(deleteProduct);

    } catch (error) {

        throw new Error(error);
    }

});

// update product quantity from cart 

const updateProductQuantity = asyncHandler(async (req, res) => {

    try {

        const { _id } = req.user;
        const { cartItemId, newQuantity } = req.params;

        console.log('cartItemId: ', cartItemId);

        validateMongoDBId(_id);

        const cartItem = await Cart.findOne({ userId: _id, _id: cartItemId });
        cartItem.quantity = newQuantity;
        cartItem.save();
        res.json(cartItem);

    } catch (error) {
        throw new Error(error);
    }

});

// empty cart user

const emptyUserCart = asyncHandler(async (req, res) => {

    try {

        const { _id } = req.user;

        validateMongoDBId(_id);

        const user = await User.findOne({ _id });

        const cart = await Cart.findOneAndDelete({ orderBy: user._id });

        res.json(cart);

    } catch (error) {

        throw new Error(error);
    }

});

// apply coupon

const applyCoupon = asyncHandler(async (req, res) => {

    try {

        const { coupon } = req.body;
        const { _id } = req.user;

        validateMongoDBId(_id);

        const findValidCoupon = await Coupon.findOne({ name: coupon });

        // console.log('findValidCoupon', findValidCoupon);

        if (findValidCoupon === null) {

            throw new Error("Invalid Coupon");
        }

        const user = await User.findOne({ _id });

        let { products, cartTotal } = await Cart.findOne({

            orderBy: user._id

        }).populate("products.product");

        let totalAfterDiscount = (cartTotal - (cartTotal * findValidCoupon.discount) / 100).toFixed(2);

        await Cart.findOneAndUpdate(
            { orderBy: user._id },
            { totalAfterDiscount },
            { new: true }
        );

        res.json(totalAfterDiscount);

    } catch (error) {

        throw new Error(error);
    }

});

// create order

// const createOrder = asyncHandler(async (req, res) => {

//     try {

//         const { _id } = req.user;
//         const { COD, couponApplied } = req.body;

//         validateMongoDBId(_id);

//         if (!COD) throw new Error("Create Cash Order Failed");

//         const user = await User.findById(_id);

//         let cartUser = await Cart.findOne({ orderBy: user._id });

//         let amount = 0;

//         if (couponApplied && cartUser.totalAfterDiscount) {

//             amount = cartUser.totalAfterDiscount;

//         } else {

//             amount = cartUser.cartTotal;
//         }

//         let newOrder = await new Order({

//             products: cartUser.products,
//             paymentIntent: {

//                 id: uniqid(),
//                 method: "COD",
//                 amount: amount,
//                 status: "Cash on Delivery",
//                 currency: "pkr"

//             },
//             orderBy: user._id,
//             orderStatus: "Cash on Delivery"

//         }).save();

//         let update = cartUser.products.map((item) => {

//             return {
//                 updateOne: {
//                     filter: { _id: item.product._id },
//                     update: { $inc: { quantity: -item.count, sold: +item.count } }
//                 }
//             }
//         });

//         const updatedOrder = await Product.bulkWrite(update, {});

//         res.json({ message: "success" });

//     } catch (error) {

//         throw new Error(error);
//     }
// });

// get orders

// const getOrders = asyncHandler(async (req, res) => {

//     const { _id, role } = req.user;
//     validateMongoDBId(_id);

//     try {
//         let orders;

//         if (role === "admin") {
//             // If admin, fetch all orders
//             orders = await Order.find()
//                 .populate("products.product")
//                 .populate("orderBy")
//                 .exec();
//         } else {
//             orders = await Order.findOne({ orderBy: _id })
//                 .populate("products.product")
//                 .populate("orderBy")
//                 .exec();
//         }

//         res.json(orders);

//     } catch (error) {
//         throw new Error(error);
//     }
// });

const createOrder = asyncHandler(async (req, res) => {

    const { shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount, paymentInfo } = req.body;

    const { _id } = req.user;

    try {

        const order = await Order.create({
            shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount, paymentInfo, user: _id
        })

        res.json({
            order,
            success: true
        })

    } catch (error) {
        throw new Error(error);
    }

});

const getOrders = asyncHandler(async (req, res) => {

    const { _id } = req.user;
    validateMongoDBId(_id);

    try {

        const ordersOfUser = await Order.findOne({ orderBy: _id })
            .populate("products.product")
            .populate("orderBy")
            .exec();

        res.json(ordersOfUser);

    } catch (error) {

        throw new Error(error);
    }

});

// get all orders

const getAllOrders = asyncHandler(async (req, res) => {

    try {

        const page = Math.max(1, parseInt(req.query.page, 10)) || 1;
        const limit = Math.max(1, parseInt(req.query.limit, 10)) || 50;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const filters = req.query.filters ? decodeURIComponent(req.query.filters) : '{}';
        let parsedFilters = {};
        try {
            parsedFilters = JSON.parse(filters);
        } catch (e) {
            return res.status(400).json({ message: 'Invalid filters format' });
        }

        console.log('Filters Parameter:', req.query.filters);
        console.log('Decoded Filters:', filters);
        console.log('Parsed Filters Object:', parsedFilters);

        const skip = (page - 1) * limit;
        const filterCriteria = {};

        // Apply filters based on matchMode
        for (const key in parsedFilters) {
            if (Object.hasOwnProperty.call(parsedFilters, key)) {
                const { value, matchMode } = parsedFilters[key];

                if (value !== null && value !== '') {
                    if (key === 'price' || key === 'quantity' || key === 'sold') {

                        const parsedValue = value.toString();

                        switch (matchMode) {
                            case 'equals':
                                filterCriteria[key] = parsedValue;
                                break;
                            case 'greaterThan':
                                filterCriteria[key] = { $gt: parsedValue };
                                break;
                            case 'lessThan':
                                filterCriteria[key] = { $lt: parsedValue };
                                break;
                            case 'greaterThanOrEqual':
                                filterCriteria[key] = { $gte: parsedValue };
                                break;
                            case 'lessThanOrEqual':
                                filterCriteria[key] = { $lte: parsedValue };
                                break;
                            default:
                                console.warn(`Unsupported matchMode for numeric field: ${matchMode}`);
                                break;
                        }
                    } else {
                        switch (matchMode) {
                            case 'equals':
                                filterCriteria[key] = value;
                                break;
                            case 'startsWith':
                                filterCriteria[key] = { $regex: `^${value}`, $options: 'i' };
                                break;
                            case 'contains':
                                filterCriteria[key] = { $regex: value, $options: 'i' };
                                break;
                            case 'notEquals':
                                filterCriteria[key] = { $ne: value };
                                break;
                            case 'endsWith':
                                filterCriteria[key] = { $regex: `${value}$`, $options: 'i' };
                                break;
                            default:
                                console.warn(`Unsupported matchMode: ${matchMode}`);
                                break;
                        }
                    }
                }
            }
        }

        console.log('Final Filter Criteria:', filterCriteria);

        // const allUserOrders = await Order.find()
        //     .populate("products.product")
        //     .populate("orderBy")
        //     .exec();

        const allUserOrders = await Order.find(filterCriteria)
            .populate("products.product")
            .populate("orderBy")
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();

        // const products = await Product.find(filterCriteria)
        //     .sort({ [sortBy]: sortOrder })
        //     .skip(skip)
        //     .limit(limit)
        //     .lean();

        console.log('Fetched all User Orders:', allUserOrders);

        const totalRecords = await Order.countDocuments(filterCriteria);

        res.json({
            data: allUserOrders,
            totalRecords,
            page,
            limit,
        });

    } catch (error) {

        console.error('Error fetching all User Orders:', error.message);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }

});

// get order by user id

const getOrderByUserId = asyncHandler(async (req, res) => {

    const { id } = req.params;
    validateMongoDBId(id);

    try {

        const ordersOfUser = await Order.findOne({ orderBy: id })
            .populate("products.product")
            .populate("orderBy")
            .exec();

        res.json(ordersOfUser);

    } catch (error) {

        throw new Error(error);
    }

});

// update order status

const updateOrderStatus = asyncHandler(async (req, res) => {

    try {

        const { status } = req.body;
        const { id } = req.params;

        validateMongoDBId(id);

        const order = await Order.findByIdAndUpdate(id, {

            orderStatus: status,
            paymentIntent: {
                status: status
            }

        }, { new: true });

        res.json(order);

    } catch (error) {

        throw new Error(error);
    }
});

// get my orders

const getMyOrders = asyncHandler(async (req, res) => {

    try {

        const { _id } = req.user;

        const orders = await Order.find({ user: _id }).populate("user").populate("orderItems.product").populate("orderItems.color");

        res.json({
            orders
        });

    } catch (error) {

        throw new Error(error);
    }
});

module.exports = { createUser, loginUser, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, adminLogin, getWishList, saveUserAddress, cartUser, getUserCart, removeProductFromCart, updateProductQuantity, emptyUserCart, applyCoupon, createOrder, getOrders, updateOrderStatus, getAllOrders, getOrderByUserId, getMyOrders };