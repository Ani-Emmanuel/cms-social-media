const { verify, decode } = require('jsonwebtoken');
const {
	LocalConfig: { SECRET }
} = require('../../../config');
const { errorResponse } = require('../helpers/response');

// Middleware that verifies Token
const verifyToken = async (req, res, next) => {
	let token;

	const tokenWithBearer = req.header('Authorization');
	if (tokenWithBearer) {
		token = tokenWithBearer.split(' ')[1];
	}

	if (!token) {
		return res
			.status(401)
			.json(errorResponse(`please login to perform this action`, 401));
	}

	try {
		const { exp } = await decode(token);
		let now = Date.now() / 1000;
		if (exp < now) {
			return res
				.status(401)
				.json(errorResponse(`The access token provided is expired`, 401));
		}

		const verifiedToken = await verify(token, SECRET);

		if (!verifiedToken._id) {
			return res
				.status(401)
				.json(
					errorResponse(
						'Invalid Token, please login to perform this action',
						401
					)
				);
		}

		next(verifiedToken);
	} catch (error) {
		next(error);
	}
};

module.exports = verifyToken;
