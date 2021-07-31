require('dotenv').config();

const config = {
	LocalConfig: {
		DBURL: process.env.DBURL,
		TEST_DB_URL: process.env.TEST_DB_URL,
		PORT: process.env.PORT || 5000,
		SECRET: process.env.SECRET,
		MAX_MEDIA_FILE_SIZE: process.env.MAX_MEDIA_FILE_SIZE
	}
};

module.exports = config;