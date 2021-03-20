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

const disallowConv = (users) => {
	let request = `UPDATE conversations SET allowed = 0
	WHERE id_user1 = ? AND id_user2 = ?
	OR id_user2 = ? AND id_user1 = ?`
	return db.query(request, users)
}

// Set Conv unallowed 

const allowConv = (conv_id) => {
	let request = `UPDATE conversations SET allowed = 1 WHERE id_conversation = ?`
	return db.query(request, [conv_id])
}


// DELETE conv 

const delConv = (id1, id2) => {
	let request = `DELETE FROM chat WHERE id_conversation IN (
					SELECT id_conversation FROM conversations
						WHERE (id_user1 = ? AND id_user2 = ?)
						OR (id_user1 = ? AND id_user2 = ?))`
	return db.query(request, [id1, id2, id2, id1])
}

module.exports = {
	getConv,
	insertConv,
	allowConv,
	disallowConv,
	delConv
}