const db = require('../utility/database')
const { user } = require('../config/db')

// Get conversation 

const getConv = (user_id , id) => {
	let request = `SELECT * FROM conversations
								WHERE 
									id_user1 = ? AND id_user2 = ?
								OR 
									id_user2 = ? AND id_user1 = ?`
	return db.query(request, [user_id, id , id , user_id])
}

// Insert new conv 

const insertConv = (user1, user2) => {
	let request = `INSERT INTO conversations (id_user1, id_user2) VALUES (?, ?)`
	return db.query(request, [user1, user2])
}

// Set Conv Allowed 

const disallowConv = (user_id, id) => {
	let request = `UPDATE conversations SET allowed = 0
	WHERE id_user1 = ? AND id_user2 = ?
	OR id_user2 = ? AND id_user1 = ?`
	return db.query(request, [user_id, id, id, user_id])
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

// get Chat for both users ((ALLLL ))

const getConvAll = (user1) => {
	let request = `SELECT
										users.id as user_id,
										conversations.id_conversation, last_update,
										users.username as username,
										users.first_name as first_name,
										users.last_name as last_name,
										users.status as status,
										images.name as profile_image,
										chat.message as message,
										chat.id_from as message_from,
										images.profile
								FROM conversations
									INNER JOIN 
										users 
									ON 
										conversations.id_user2 = users.id
									LEFT JOIN 
										images 
									ON 
										conversations.id_user2 = images.user_id
									LEFT JOIN 
										chat 
									ON 
										conversations.last_msg = chat.id
									WHERE 
											conversations.id_user1 = ?
										AND 
											conversations.allowed = 1
									UNION SELECT
										users.id as user_id,
										conversations.id_conversation, last_update,
										users.username as username,
										users.first_name as first_name,
										users.last_name as last_name,
										users.status as status,
										images.name as profile_image,
										chat.message as message,
										chat.id_from as message_from,
										images.profile
									FROM conversations
									INNER JOIN 
										users 
									ON
										conversations.id_user1 = users.id
									LEFT JOIN 
										images
									ON 
										conversations.id_user1 = images.user_id
									LEFT JOIN 
										chat 
									ON 
										conversations.last_msg = chat.id
									WHERE 
											conversations.id_user2 = ?
										AND 
											conversations.allowed = 1`
	return db.query(request, [user1, user1])
}

// Get chat 

const getChat = (id, limit) => {
	let request = `SELECT * FROM chat WHERE id_conversation = ? ORDER BY created_at DESC LIMIT ?, 50`
	return db.query(request, [id, limit])
}

// Update seen message 

const seenMsg = (id_conv, id_from) => {
	let request = `UPDATE chat SET is_read = 1 WHERE id_conversation = ? AND id_from != ?`
	return db.query(request, [id_conv, id_from])
}

// Get convo from id_conv / u1 & u2

const getConversation = (id_conv, id1, id2) => {
	let request = `SELECT * FROM conversations WHERE id_conversation = ? AND (id_user1 = ? OR id_user2 = ?)`
	return db.query(request, [id_conv, id1, id2])
}

// INSERT Message 

const insertMsg = (msg) => {
	let request = `INSERT INTO chat (id_conversation, id_from, message, created_at) VALUES (?, ?, ?, ?)`
	return db.query(request, Object.values(msg))
}

// Update conv 

const updateConv = (date, insertID, id_conv) => {
	let request = `UPDATE conversations SET last_update = ?, last_msg = ? WHERE id_conversation = ?`
	return db.query(request, [date, insertID, id_conv])
}


module.exports = {
	getConv,
	insertConv,
	allowConv,
	disallowConv,
	delConv,
	getConvAll,
	getChat,
	seenMsg,
	getConversation,
	insertMsg,
	updateConv
}