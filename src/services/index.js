const { createPost, getPost, updatePost, deletePost } = require('./post');
const userLogin = require('./auth/login');
const userRegistration = require('./auth/registration');

module.exports = {
	createPost,
	getPost,
	updatePost,
	deletePost,
	userLogin,
	userRegistration
};
