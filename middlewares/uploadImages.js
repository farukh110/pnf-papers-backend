const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

// multer storage

const multerStorage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, path.join(__dirname, "../public/images"));
    },
    filename: function (req, file, cb) {

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(null, file.filename + "-" + uniqueSuffix + ".jpeg");
    }
});

// multer filter

const multerFilter = (req, file, cb) => {

    if (file.mimeType.startsWith('image')) {

        cb(null, true);

    } else {

        cb({
            message: "Unsupported File Format"
        }, false);
    }
};

// upload photo

const uploadPhoto = multer({

    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 2000000 }

});

// product resize

const productImageResize = async (req, res, next) => {

    if (!req.files) return next();

    await Promise.all(req.files.map(async (file) => {

        await sharp(file.path).resize(300, 300).toFormat("jpeg").jpeg({ quality: 95 }).toFile(`public/images/products/${file.filename}`);

    }));
    next();
};

// product resize

const blogImageResize = async (req, res, next) => {

    if (!req.files) return next();

    await Promise.all(req.files.map(async (file) => {

        await sharp(file.path).resize(300, 300).toFormat("jpeg").jpeg({ quality: 95 }).toFile(`public/images/blogs/${file.filename}`);

    }));
    next();
};

module.exports = { uploadPhoto, productImageResize, blogImageResize };