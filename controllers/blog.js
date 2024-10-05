const Blog = require('../models/blog');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { validateMongoDBId } = require('../utilities/validateMongoDBId');
const { cloudinaryUploadImage } = require('../utilities/cloudinary');
const fs = require('fs');

// create blog

const createBlog = asyncHandler(async (req, res) => {

    try {

        const newBlog = await Blog.create(req.body);

        res.json(newBlog);

    } catch (error) {

        throw new Error(error);
    }
});

// update blog

const updateBlog = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });

        res.json(updateBlog);

    } catch (error) {

        throw new Error(error);
    }

});

// get blog

const getBlog = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const blog = await Blog.findById(id).populate('likes');

        await Blog.findByIdAndUpdate(

            id,
            {
                $inc: { numViews: 1 }
            },
            {
                new: true
            }
        );

        res.json(blog);

    } catch (error) {

        throw new Error(error);
    }

});

// get all blogs

// const getAllBlogs = asyncHandler(async (req, res) => {

//     try {

//         const blogs = await Blog.find();

//         res.json(blogs);

//     } catch (error) {

//         throw new Error(error);
//     }

// });

const getAllBlogs = asyncHandler(async (req, res) => {

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

        const blogs = await Blog.find(filterCriteria)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean();

        console.log('Fetched Blogs:', blogs);

        const totalRecords = await Blog.countDocuments(filterCriteria);

        res.json({
            data: blogs,
            totalRecords,
            page,
            limit,
        });


    } catch (error) {

        console.error('Error fetching blogs:', error.message); // Enhanced error logging
        res.status(500).json({ message: 'Server error, please try again later.' });
    }

});

// delete blog

const deleteBlog = asyncHandler(async (req, res) => {

    try {

        const { id } = req.params;

        validateMongoDBId(id);

        const deleteBlog = await Blog.findByIdAndDelete(id);

        res.json(deleteBlog);

    } catch (error) {

        throw new Error(error);
    }

});

// liked blog

const likeBlog = asyncHandler(async (req, res) => {

    try {

        const { blogId } = req.body;

        validateMongoDBId(blogId);

        const blog = await Blog.findById(blogId);

        const loginUserId = req?.user?._id;

        const isLiked = blog?.isLiked;

        const alreadyDisliked = blog?.dislikes?.find(

            (userId => userId?.toString() === loginUserId?.toString())
        );

        if (alreadyDisliked) {

            const blog = await Blog.findByIdAndUpdate(blogId, {

                $pull: { dislikes: loginUserId },
                isDisLiked: false
            }, { new: true });

            res.json(blog);
        }

        if (isLiked) {

            const blog = await Blog.findByIdAndUpdate(blogId, {

                $pull: { likes: loginUserId },
                isLiked: false
            }, { new: true });

            res.json(blog);

        } else {

            const blog = await Blog.findByIdAndUpdate(blogId, {

                $push: { likes: loginUserId },
                isLiked: true
            }, { new: true });

            res.json(blog);

        }

    } catch (error) {

        throw new Error(error);
    }

});

// disliked blog

const disLikedBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.body;

        validateMongoDBId(blogId);

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const loginUserId = req?.user?._id;
        const isDisLiked = blog.isDisLiked;
        const alreadyLiked = blog.likes.includes(loginUserId);

        if (alreadyLiked) {
            await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId },
                isLiked: false
            }, { new: true });
        }

        if (isDisLiked) {
            const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { dislikes: loginUserId },
                isDisLiked: false
            }, { new: true });

            res.json(updatedBlog);
        } else {
            const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
                $push: { dislikes: loginUserId },
                isDisLiked: true
            }, { new: true });

            res.json(updatedBlog);
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// upload images

const uploadImages = asyncHandler(async (req, res) => {

    // console.log('uploaded files: ', req.files);

    try {

        const { id } = req.params;

        const uploader = (path) => cloudinaryUploadImage(path, "images");

        const imagesUrls = [];

        const imageFiles = req.files;

        for (const item of imageFiles) {

            const { path } = item;

            const newPath = await uploader(path);

            imagesUrls.push(newPath);

            fs.unlinkSync(path);
        }

        const blog = await Blog.findByIdAndUpdate(id, {

            images: imagesUrls.map((fileItem) => {

                return fileItem;

            })

        }, {
            new: true
        });

        res.json(blog);

    } catch (error) {

        throw new Error(error);
    }

});

module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, disLikedBlog, uploadImages };

