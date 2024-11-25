const asyncHandler = require('express-async-handler');
const { cloudinaryUploadImage, cloudinaryDeleteImage } = require('../utilities/cloudinary');
const fs = require('fs');

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

module.exports = { uploadImages, deleteImages };