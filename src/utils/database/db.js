const mongoose = require('mongoose');
const {
	LocalConfig: { DBURL, TEST_DB_URL }
} = require('../../../config');

function dbConnection() {
	mongoose.connect(
		DBURL,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		},
		(error) => {
			if (error) return new Error('Failed to connect to database');
			console.log("we connected to db");
		}
	);
}

function testDbConnection() {
	mongoose.connect(
		TEST_DB_URL,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		},
		(error) => {
			if (error) return new Error('Failed to connect to database');
			console.log('we are connected to test db');
		}
	);
}

module.exports = {
	dbConnection,
	testDbConnection
};
