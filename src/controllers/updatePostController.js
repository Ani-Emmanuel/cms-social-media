const { unlinkSync, unlink } = require('fs');
const { join } = require('path');
const { getPost, updatePost } = require('../services');
const {
	imageUpload,
	Schemas: { editPostSchema },
	successResponse,
	formDataValidation
} = require('../utils');

const updatePosts = async ({ _id: userId }, req, res, next) => {
	imageUpload(req, res, async (err) => {
		if (err) {
			return res.status(500).json(validationResponse(err.message));
		}
		try {
			const { body } = req;
			// const data = {};
			// for (const key in body) {
			// 	data[key] = body[key];
			// }
			const data = JSON.parse(JSON.stringify(body));
			const error = await formDataValidation(editPostSchema, data);

			if (error) {
				unlink(req.file.path, function (err) {
					if (err) throw err;
				});
				return res.status(400).json(validationResponse(error, 400));
			}

			const _id = req.params.id;
			const filter = { _id, userId };

			//checks if image is changed
			if (req.file) {
				const post = await getPost(filter);
				if (post[0].image)
					unlinkSync(`${post[0].image}`);
				body.image = req.file.path;
			}

			//this updates the post
			const updatedpost = await updatePost(filter, data);
			res.status(200).json(successResponse('updated success', updatedpost));
		} catch (error) {
			next(error);
		}
	});
};

module.exports = updatePosts;
