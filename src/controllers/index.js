const createPosts = require('./createPostController');
const deletePosts = require('./deletePostController');
const getPosts = require('./getPostController');
const userLogins = require('./loginController');
const userRegistrations = require('./registrationController');
const updatePosts = require('./updatePostController');

module.exports = {
	createPosts,
	deletePosts,
	getPosts,
	userLogins,
	userRegistrations,
	updatePosts
};
