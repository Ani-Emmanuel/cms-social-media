const { getPost } = require('../services');
const { successResponse, errorResponse } = require('../utils');

const getPosts = async (_id, req, res, next) => {
	try {
		const query = {};
		if (req.params.id) {
			query._id = req.params.id;
		}

		const posts = await getPost(query);
		if (!posts.length) {
			return res.status(404).json({ message: 'no record found' });
		}
		res.status(200).json(successResponse(null, posts, 200));
	} catch (error) {
		next(error);
	}
};

module.exports = getPosts;
