const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const User = require('../models/user');
const { cloudinaryUploadImage, cloudinaryDeleteImage } = require('../utilities/cloudinary');
const fs = require('fs');

// create product

const createProduct = asyncHandler(async (req, res) => {

    try {

        if (req.body.title) {

            req.body.slug = slugify(req.body.title);
        }

        const newProduct = await Product.create(req.body);

        res.json(newProduct);

    } catch (error) {

        throw new Error(error);
    }
});

// update product

const updateProduct = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }

        const updateProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

        res.json(updateProduct);

    } catch (error) {

        throw new Error(error);

    }

});

// delete product

const deleteProduct = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        const deleteProduct = await Product.findByIdAndDelete(id);

        res.json(deleteProduct);

    } catch (error) {

        throw new Error(error);
    }

});

// get product

const getProduct = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        const findProduct = await Product.findById(id);

        res.json(findProduct);

    } catch (error) {

        throw new Error(error);
    }

});

// get all products

// const getAllProducts = asyncHandler(async (req, res) => {

//     try {

//         console.log('req.query: ', req.query);

//         // const allProducts = await Product.find(req.query);

//         // const allProducts = await Product.find({
//         //     brand: req.query.brand,
//         //     category: req.query.category
//         // });

//         const queryObj = { ...req.query };

//         const excludeFields = ["page", "sort", "limit", "fields"];

//         excludeFields.forEach((el) => delete queryObj[el]);

//         console.log('query obj: ', queryObj, excludeFields);

//         // const allProducts = await Product.where("category").equals(
//         //     req.query.category
//         // );

//         console.log('queryObj ---------> ', queryObj);

//         let queryStr = JSON.stringify(queryObj);
//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//         // console.log('queryStr: ', JSON.parse(queryStr));

//         let query = Product.find(JSON.parse(queryStr));

//         // const allProducts = await Product.find(queryObj);

//         // sorting

//         if (req.query.sort) {

//             const sortBy = req.query.sort.split(",").join(" ");

//             query = query.sort(sortBy);

//         } else {

//             query = query.sort("-createdAt");

//         }

//         // limiting the fields

//         if (req.query.fields) {

//             const fields = req.query.fields.split(",").join(" ");

//             query = query.select(fields);

//         } else {

//             query = query.select('-__v');

//         }

//         // pagination

//         const page = req.query.page;
//         const limit = req.query.limit;
//         const skip = (page - 1) * limit;

//         query = query.skip(skip).limit(limit);

//         if (req.query.page) {

//             const productCount = await Product.countDocuments();

//             if (skip >= productCount) {

//                 throw new Error("This Page does not exists");
//             }
//         }

//         console.log(page, limit, skip);

//         const product = await query;

//         res.json(product);

//     } catch (error) {

//         throw new Error(error);
//     }
// });

const getAllProducts = asyncHandler(async (req, res) => {

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

        const products = await Product.find(filterCriteria)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();

        console.log('Fetched Products:', products);

        const totalRecords = await Product.countDocuments(filterCriteria);

        res.json({
            data: products,
            totalRecords,
            page,
            limit,
        });

    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
});

// add to wish list

const addToWishList = asyncHandler(async (req, res) => {

    try {

        const { _id } = req.user;
        const { prodId } = req.body;

        const user = await User.findById(_id);

        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);

        if (alreadyAdded) {

            let user = await User.findByIdAndUpdate(_id, {

                $pull: { wishlist: prodId }

            }, {
                new: true
            });

            res.json(user);

        } else {

            let user = await User.findByIdAndUpdate(_id, {

                $push: { wishlist: prodId }

            }, {
                new: true
            });

            res.json(user);

        }

    } catch (error) {

        throw new Error(error);
    }

});

// product rating

const productRating = asyncHandler(async (req, res) => {

    try {

        const { _id } = req.user;
        const { star, prodId, comment } = req.body;

        const product = await Product.findById(prodId);

        let alreadyRated = product.ratings.find(
            (userId) => userId.postedBy.toString() === _id.toString()
        );

        if (alreadyRated) {

            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated }
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment }
                },
                {
                    new: true
                }
            );

            // res.json(updateRating);

        } else {

            const rateProduct = await Product.findByIdAndUpdate(

                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedBy: _id
                        }
                    }
                },
                {
                    new: true
                }
            );

            // res.json(rateProduct);
        }

        const getAllRatings = await Product.findById(prodId);

        let totalRating = getAllRatings.ratings.length;

        let totalRatingSum = getAllRatings.ratings.map((item) => item.star).reduce((prev, current) => prev + current, 0);

        let actualRatingValue = Math.round(totalRatingSum / totalRating);

        let finalProductItem = await Product.findByIdAndUpdate(prodId, {

            totalRating: actualRatingValue

        }, { new: true });

        res.json(finalProductItem);

    } catch (error) {

        throw new Error(error);
    }

});

// upload images

const uploadImages = asyncHandler(async (req, res) => {

    // console.log('uploaded files: ', req.files);

    try {

        // const { id } = req.params;

        const uploader = (path) => cloudinaryUploadImage(path, "images");

        const imagesUrls = [];

        const imageFiles = req.files;

        for (const item of imageFiles) {

            const { path } = item;

            const newPath = await uploader(path);

            imagesUrls.push(newPath);

            fs.unlinkSync(path);
        }

        const images = imagesUrls.map((fileItem) => {

            return fileItem;

        });

        res.json(images);

        // const product = await Product.findByIdAndUpdate(id, {

        //     images: imagesUrls.map((fileItem) => {

        //         return fileItem;

        //     })

        // }, {
        //     new: true
        // });


    } catch (error) {

        throw new Error(error);
    }

});

// delete images

const deleteImages = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        const removeImages = cloudinaryDeleteImage(id, "images");

        res.json({ message: "Image has been Deleted" });

    } catch (error) {

        throw new Error(error);
    }

});

module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct, addToWishList, productRating, uploadImages, deleteImages };