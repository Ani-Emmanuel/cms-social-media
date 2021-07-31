const { unlinkSync } = require('fs');
const { User } = require('../../models');
const { errorResponse, encryptPassword } = require('../../utils');
const UserRegistration = async (payload) => {
	const { email, password, image } = payload;
	const user = await User.findOne({ email });

	//check if user already exist
	if (user) {
		if (image) {
			unlinkSync(image);
		}
		throw errorResponse('user already exist', 409);
	}

	payload.password = await encryptPassword(password);
	const newUser = new User(payload);
	const result = await newUser.save();
	const data = JSON.parse(JSON.stringify(result));

	delete data.password;
	return data;
};

module.exports = UserRegistration;
