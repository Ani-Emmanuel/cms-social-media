const bcrypt = require('bcryptjs');

// Function for decrypting hashed password and compare for login
const decryptPassword = async (password, hashedPass) => {
	try {
		const operationResult = await bcrypt.compare(password, hashedPass);
		return operationResult;
	} catch (error) {
		return error;
	}
};

module.exports = decryptPassword;
