const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY
});

// upload image 

const cloudinaryUploadImage = async (fileToUploads) => {

    try {

        return new Promise((resolve) => {

            cloudinary.uploader.upload(fileToUploads, (result) => {

                resolve(
                    {
                        url: result.secure_url,
                        asset_id: result.asset_id,
                        public_id: result.public_id
                    },
                    {
                        resource_type: "auto"
                    }
                );

            });

        });

    } catch (error) {

        throw new Error(error);
    }

};

// upload image 

const cloudinaryDeleteImage = async (fileToDelete) => {

    try {

        return new Promise((resolve) => {

            cloudinary.uploader.destroy(fileToDelete, (result) => {

                resolve(
                    {
                        url: result.secure_url,
                        asset_id: result.asset_id,
                        public_id: result.public_id
                    },
                    {
                        resource_type: "auto"
                    }
                );

            });

        });

    } catch (error) {

        throw new Error(error);
    }

};

module.exports = { cloudinaryUploadImage, cloudinaryDeleteImage };