const db = require('../utility/database')

// Get conversation 

const getConv = (users) => {
	let request = `SELECT * FROM conversations
								WHERE 
									id_user1 = ? AND id_user2 = ?
								OR 
									id_user2 = ? AND id_user1 = ?`
	return db.query(request, [...data, ...data])
}

// Insert new conv 

const insertConv = (users) => {
	let request = `INSERT INTO conversations (id_user1, id_user2) VALUES (?, ?)`
	return db.query(request, users)
}

// Set Conv Allowed 

const allowConv = (users) => {
	let request = `UPDATE conversations SET allowed = 0
	WHERE id_user1 = ? AND id_user2 = ?
	OR id_user2 = ? AND id_user1 = ?`
	return db.query(request, users)
}

// Set Conv unallowed 

const disallowConv = (conv_id) => {
	let request = `UPDATE conversations SET allowed = 1 WHERE id_conversation = ?`
	return db.query(request, [conv_id])
}


module.exports = {
	getConv,
	insertConv,
	allowConv,
	disallowConv
}