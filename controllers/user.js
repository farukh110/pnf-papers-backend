const { generateToken } = require('../config/jwtToken');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { validateMongoDBId } = require('../utilities/validateMongoDBId');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');

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

        const users = await User.find();
        res.json(users);

    } catch (error) {

        throw new Error(error);
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

module.exports = { createUser, loginUser, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout };