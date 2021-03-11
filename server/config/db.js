const dbconf = {
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: '',
	database: process.env.DB_NAME,
	charset: 'utf8'
}

module.exports = dbconf
