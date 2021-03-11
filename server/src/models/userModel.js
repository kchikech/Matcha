const db = require('../utility/database')

// add user

const addUser = (user, callback) => {
	let request = `INSERT INTO users (first_name, last_name, username, email, password, vkey) VALUES
								('${user.first_name}',
								'${user.last_name}',
								'${user.username}',
								'${user.email}',
								'${user.password}',
								'${user.vkey}')`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Get user by Username / email 

const getUser = (user, callback) => {
	let request = `SELECT email, username FROM users WHERE username = '${user.username}' OR email = '${user.email}'`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Check Verif key 

const getVkey = (vkey, callback) => {
	let request = `SELECT verified, id FROM users WHERE vkey = '${vkey}'`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Validate an Email 

const validateEmail = (vkey, callback) => {
	let request = `UPDATE users SET verified = 1 WHERE vkey = '${vkey}' AND verified = 0`
	db.query(request, (error) => {
		if (error) throw error
		callback()
	})
}

// Get user data by ID

const getUserById = (id, callback) => {
	let request = `SELECT * from users WHERE id='${id}'`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Get user data by Username 

const getUserByUsername = (username, callback) => {
	let request = `SELECT * from users WHERE username='${username}'`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

module.exports = {
	addUser,
	getUser,
	getVkey,
	validateEmail,
	getUserById,
	getUserByUsername
}