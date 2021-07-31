const jwt = require('jsonwebtoken');

// Function for Generation token
const genToken = async (id, secret) => {
	try {
		const token = await jwt.sign(
			{
				_id: id,
				exp: Math.floor(Date.now() / 1000) + 60 * 60
			},
			secret
		);
		return token;
	} catch (error) {
		return error;
	}
};

module.exports = genToken;
