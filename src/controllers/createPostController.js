const { unlink } = require('fs');
const { createPost } = require('../services');
const {
	successResponse,
	imageUpload,
	validationResponse,
	Schemas: { postSchema },
	formDataValidation
} = require('../utils');

const createPosts = async ({ _id }, req, res, next) => {
	imageUpload(req, res, async (err) => {
		if (err) {
			return res.status(500).json(validationResponse(err.message));
		}
		try {
			const { body } = req;
			const data = {
				title: body.title,
				description: body.description
			};

			const error = await formDataValidation(postSchema, data);

			//if there is an error remove the uploaded file
			if (error) {
				unlink(req.file.path, function (err) {
					if (err) throw err;
				});
				return res.status(400).json(validationResponse(error.message, 400));
			}

			data.image = req.file.path;
			data.userId = _id;

			const post = await createPost(data);
			res.status(201).json(successResponse('post created', post, 201));
		} catch (error) {
			next(error);
		}
	});
};

module.exports = createPosts;
