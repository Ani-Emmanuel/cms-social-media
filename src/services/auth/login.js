const { User } = require('../../models');
const { decryptPassword, generateJWT, errorResponse } = require('../../utils');
const {
	LocalConfig: { SECRET }
} = require('../../../config');
const UserLogin = async (payload) => {
	const { email, password } = payload;
	const user = await User.findOne({ email });
	if (!user) {
		throw errorResponse('User does not exist', 404);
	}

	//Compares your password
	const pass = await decryptPassword(password, user.password);

	if (!pass) {
		throw errorResponse('Invalid username or password', 401);
	}

	//Generates a token for you
	const token = await generateJWT(user._id, SECRET);

	return token;
};

module.exports = UserLogin;
