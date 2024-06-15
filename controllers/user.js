const { generateToken } = require('../config/jwtToken');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

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

        const block = User.findByIdAndUpdate(
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

        const unblock = User.findByIdAndUpdate(

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

module.exports = { createUser, loginUser, getAllUsers, getUser, deleteUser, updateUser, blockUser, unblockUser };