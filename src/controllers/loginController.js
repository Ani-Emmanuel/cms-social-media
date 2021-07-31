const { userLogin } = require('../services');
const { successResponse } = require('../utils');

const userLogins = async (req, res, next) => {
	try {
		const { body } = req;
		const token = await userLogin(body);
		res.status(200).json(successResponse('success', token, 200));
	} catch (error) {
		next(error);
	}
};

module.exports = userLogins;