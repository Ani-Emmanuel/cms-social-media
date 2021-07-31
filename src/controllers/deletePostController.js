const { unlinkSync, existsSync } = require('fs');
const { deletePost } = require('../services');
const { successResponse } = require('../utils');

const deletePosts = async ({ _id: userId }, req, res, next) => {
	try {
		const filter = {
			_id: req.params.id,
			userId
		};
		const post = await deletePost(filter);

		//check if the image exist and remove from the uploads
		if (post) {
			if (existsSync(post.image)) {
				unlinkSync(post.image);
			}
		}
		res.status(200).json(successResponse('post deleted successfully', 200));
	} catch (error) {
		next(error);
	}
};

module.exports = deletePosts;
