const express = require('express');
const cors = require('cors');
const { dbConnection, testDbConnection } = require('./src/utils');
const {
	LocalConfig: { PORT }
} = require('./config');
const route = require('./src/routes/routes');

const app = express();

if (process.env.NODE_ENV === 'test') {
	testDbConnection();
} else {
	dbConnection();
}

// Middlewares for service request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(route);
// middleware for handling file not found error
app.use((req, res, next) => {
	const err = new Error('Request not found');
	res.status(404).send(err.message);
});

// middleware for handling all errors
app.use((err, req, res, next) => {
	const codes = [200, 201, 400, 401, 404, 403, 422, 409, 500];
	const error =
		app.get('env') === 'development'
			? err
			: app.get('env') === 'test'
			? err
			: {};

	const status = codes.includes(error.code) ? error.code : 500;
	if (status === 500) {
		return res
			.status(status)
			.send('Something went wrong, please contact the admin');
	}
	res.status(status).json(error);
});

module.exports = app;
// app.listen(PORT || 3000, () => console.log(`We are live on port ${PORT}`));
