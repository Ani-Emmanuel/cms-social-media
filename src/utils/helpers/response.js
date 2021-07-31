module.exports = {
	successResponse: (message, data, statusCode) => {
		return {
			message,
			error: false,
			code: statusCode,
			data
		};
	},

	errorResponse: (message, statusCode) => {
		// List of common HTTP request code
		const codes = [200, 201, 400, 401, 404, 403, 422, 409, 500];

		// Get matched code
		const findCode = codes.find((code) => code == statusCode);

		if (!findCode) {
			statusCode = 500;
		} else {
			statusCode = findCode;
		}

		return {
			message,
			code: statusCode,
			error: true
		};
	},

	validationResponse: (errors) => {
		let messages = [];
		for (const item of errors) {
			let data = {};
			data['message'] = item.message;
			data['path'] = item.path;
			data['problem'] = item.context.invalids;

			messages.push(data);
		}
		return {
			message: messages,
			code: 400,
			error: true
		};
	}
};
