const multer = require('multer');
const fs = require('fs');
const { join } = require('path');
const {
	LocalConfig: { MAX_MEDIA_FILE_SIZE }
} = require('../../../config');

const fileFilter = (req, file, cb) => {
	try {
		if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
			return cb(new Error('Only jpeg, jpg, png images allowed'));
		}

		if (req.headers['content-length'] > 2000000) {
			return cb(
				new Error(
					`File size exceeded, your image should not be more than ${MAX_MEDIA_FILE_SIZE}`
				)
			);
		} // Multer Filesize limit doesn't work yet. There is still an open issue in the Multer repo for this issue
		// https://github.com/expressjs/multer/issues/344 for now, this should work
		cb(null, true);
	} catch (error) {
		new Error(error);
	}
};

// creating the directory if the directory does not exist
if (!fs.existsSync(join(__dirname, '../../uploads'))) {
	fs.mkdirSync(join(__dirname, '../../uploads/test'), { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		try {
			if (process.env.NODE_ENV == 'test') {
				cb(null, join(__dirname, '../../uploads/test/'));
			} else {
				cb(null, join(__dirname, '../../uploads/'));
			}
		} catch (error) {
			new Error(error);
		}
	},

	filename: (req, file, cb) => {
		try {
			cb(null, new Date().toISOString() + file.originalname);
		} catch (error) {
			new Error(error);
		}
	}
});

const imageUpload = multer({
	storage,
	fileFilter
}).single('image');

module.exports = imageUpload;
