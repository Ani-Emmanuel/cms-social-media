const { Post } = require('../models');
const { errorResponse } = require('../utils');

//this function creates a post
const createPost = async (payload) => {
	const post = new Post(payload);
	const newPost = await post.save();
	return newPost;
};

//this is a generic function that finds a post
const getPost = async (filter) => {
	const post = await Post.find(filter);
	return post;
};

//this function finds a post by ID and updates
const updatePost = async (filter, payload) => {
	const { _id } = filter;
	const checkPostId = await getPost({ _id });
	const checkUserId = await getPost(filter);

	if (checkPostId.length && checkUserId.length) {
		const post = await Post.findOneAndUpdate(
			filter,
			{ $set: payload },
			{ new: true }
		);

		return post;
	} else if (checkPostId.length && !checkUserId.length) {
		throw errorResponse('you are not authorized', 401);
	} else {
		throw errorResponse('post does not exist', 404);
	}
};

//this function finds a post by ID and deletes
const deletePost = async (filter) => {
	const { _id } = filter;
	const checkPostId = await getPost({ _id });
	const checkUserId = await getPost(filter);
	if (checkPostId.length && checkUserId.length) {
		const post = await Post.findOneAndRemove(filter);
		return post;
	} else if (checkPostId.length && !checkUserId.length) {
		throw errorResponse('you are not authorized', 401);
	} else {
		throw errorResponse('post does not exist', 404);
	}
};

module.exports = { createPost, getPost, updatePost, deletePost };
