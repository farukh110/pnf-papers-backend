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

const getAllBlogs = asyncHandler(async (req, res) => {

    try {

        const blogs = await Blog.find();

        res.json(blogs);

    } catch (error) {

        throw new Error(error);
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

