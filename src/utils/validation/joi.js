const joi = require('joi');
const { validationResponse } = require('../helpers/response');
const formDataValidation = async (schema, body) => {
	const result = await schema.validate(body, { abortEarly: false });
	if (result.error) {
		throw validationResponse(result.error.details);
	}
};

const queryParamValidation = (schema) => {
	return (req, res, next) => {
		const result = schema.validate(req.query, { abortEarly: false });
		if (result.error) {
			throw validationResponse(result.error.details);
		}
		next();
	};
};

const paramValidation = (schema, name) => {
	return (req, res, next) => {
		const result = schema.validate(
			{ param: req['params'][name] },
			{ abortEarly: false }
		);
		if (result.error) {
			throw validationResponse(result.error.details);
		} else {
			if (!req.value) req.value = {};
			if (!req.value['params']) req.value['params'] = {};
			req.value['params'][name] = result.value.param;
			next();
		}
	};
};

function bodyValidation(schema) {
	return (req, res, next) => {
		const result = schema.validate(req.body, { abortEarly: false });

		if (result.error) {
			throw validationResponse(result.error.details);
		} else {
			if (!req.value) req.value = {};
			if (!req.value['body']) req.value['body'] = {};
			req.value['body'] = result.value;
			next();
		}
	};
}

const Schemas = {
	idSchema: joi.object().keys({
		param: joi
			.string()
			.regex(/^[0-9a-fA-F]{24}$/)
			.required()
	}),

	postSchema: joi.object().keys({
		title: joi.string().required(),
		description: joi.string().required()
	}),

	editPostSchema: joi.object().keys({
		title: joi.string(),
		description: joi.string()
	}),

	userSchema: joi.object().keys({
		name: joi.string().required(),
		email: joi.string().email().required(),
		password: joi.string().required()
	}),

	userSchema: joi.object().keys({
		name: joi.string(),
		email: joi.string().email(),
		password: joi.string()
	}),

	loginSchema: joi.object().keys({
		email: joi.string().email().required(),
		password: joi.string().required()
	}),

	queryParamSchema: (parameters) => {
		let obj = {};
		parameters.forEach((param) => {
			obj[param] = joi.string().regex(/[a-zA-Z0-9]/);
		});
		return joi.object().keys(obj);
	}
};

module.exports = {
	formDataValidation,
	queryParamValidation,
	paramValidation,
	bodyValidation,
	Schemas
};
