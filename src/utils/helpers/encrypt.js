const bcrypt = require('bcryptjs');

// Function for encrypting the password before saving
const encryptPassword = async (password) => {
	try {
		const salt = await bcrypt.genSalt(12);
		const hashedPass = await bcrypt.hash(password, salt);
		return hashedPass;
	} catch (error) {
		return error;
	}
};

module.exports = encryptPassword;
