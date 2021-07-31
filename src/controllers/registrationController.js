const { unlinkSync } = require('fs');
const { userRegistration } = require('../services');
const {
	successResponse,
	imageUpload,
	validationResponse,
	Schemas: { userSchema },
	formDataValidation
} = require('../utils');

const userRegistrations = async (req, res, next) => {
	imageUpload(req, res, async (err) => {
		if (err) {
			return res.status(500).json(validationResponse(err.message));
		}
		try {
			const { body } = req;
			const data = JSON.parse(JSON.stringify(body))

			const error = await formDataValidation(userSchema, data);

			if (error) {
				unlinkSync(req.file.path);
				return res.status(400).json(validationResponse(error, 400));
			}

			if (req.file) {
				data.image = req.file.path;
			}
			
			const user = await userRegistration(data);
			res.status(201).json(successResponse('user created', user, 201));
		} catch (error) {
			next(error);
		}
	});
};

module.exports = userRegistrations;
