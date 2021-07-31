const { encryptPassword, decryptPassword, generateJWT } = require('../utils');
const { verify } = require('jsonwebtoken');

describe('Helper functions', () => {
	let hashedPassword = '';
	const pass = 'password';
	let token = '';
  const payload = { _id: '6103d109f4af2083afd5d524' }
	const secret = 'ILOVEJESUS';
  
	it('it should hash the password', async () => {
		hashedPassword = await encryptPassword(pass);
		expect(hashedPassword).not.toEqual(pass);
		expect(hashedPassword.length > pass.length).toBeTruthy();
	});

	it('should decode the hashed password', async () => {
		const decryptedPas = await decryptPassword(pass, hashedPassword);
		expect(decryptedPas).toBeTruthy();
	});

	it('should generate a token', async () => {
		token = await generateJWT(payload, secret);
		expect(token).toBeTruthy();
	});

	it('should verify the authenticity of the token', async () => {
		const result = await verify(token, secret);
    
    expect(result._id).toHaveProperty('_id')
    expect(result).toHaveProperty('exp')
    expect(result._id._id).toEqual(payload._id);
	});
});
