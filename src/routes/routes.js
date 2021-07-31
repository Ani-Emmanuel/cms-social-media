const { Router } = require('express');
const {
	updatePosts,
	userLogins,
	userRegistrations,
	getPosts,
	deletePosts,
	createPosts
} = require('../controllers');
const {
	verifiedToken,
	bodyValidation,
	paramValidation,
	Schemas: {
		postSchema,
		editPostSchema,
		userSchema,
		idSchema,
		loginSchema,
		queryParamSchema
	}
} = require('../utils');

const route = Router();

//route for user resgistration
route.post(
	'/api/v1/registration',
	// bodyValidation(userSchema),
	userRegistrations
);

//route for user login
route.post('/api/v1/login', bodyValidation(loginSchema), userLogins);

//route to create a post
route.post('/api/v1/create-post', [verifiedToken], createPosts);

//route to get posts
route.get('/api/v1/get-all-posts', [verifiedToken], getPosts);

//route to get on post
route.get(
	'/api/v1/get-one-post/:id',
	[verifiedToken, paramValidation(idSchema, "id")],
	getPosts
);

//route to update post
route.patch(
	'/api/v1/update-post/:id',
	[
		verifiedToken,
		paramValidation(idSchema, "id"),
		bodyValidation(editPostSchema)
	],
	updatePosts
);

//route to delete post
route.delete(
	'/api/v1/delete-post/:id',
	[verifiedToken, paramValidation(idSchema, "id")],
	deletePosts
);

module.exports = route;
