const db = require('../utility/database')

// INSERT INTO Notif [visit]

const insertNotifVis = (user_id, id) => {
	let request = `INSERT INTO notifications (type, id_from, id_to) VALUES ('visit', ?, ?)`
	return db.query(request, [user_id, id])
}

// Inset notif (variable type)

const insertNotif = (type, user_id, id) => {
	let request = `INSERT INTO notifications (type, id_from, id_to) VALUES (?, ?, ?)`
	return db.query(request, [type, user_id, id])
}

// Delete notificaton 

const delNotif = (id, user_id) => {
	let request = `DELETE FROM notifications WHERE (id_from = ? AND id_to = ?) OR (id_from = ? AND id_to = ?)`
	return db.query(request, [id, user_id, user_id, id])
}

// Inset notif (variable type)

const insertNotifConv = (type, id_from, id_to, id_conversation) => {
	let request = `INSERT INTO notifications (type, id_from, id_to, id_conversation) VALUES (?, ?, ?, ?)`
	return db.query(request, [type, id_from, id_to, id_conversation])
}

// Get all 

const getNotif = (id) => {
	let request = `SELECT
											notifications.id,
											notifications.id_from as id_from,
											notifications.created_at as date,
											notifications.is_read as is_read,
											notifications.type as type,
											users.username as username,
											images.name as profile_image,
											images.profile as profile,
											images.cover as cover
									FROM notifications
										INNER JOIN users
										ON 
											notifications.id_from = users.id
										LEFT JOIN images
										ON 
											notifications.id_from = images.user_id
										where 
											notifications.id_to = ?
										AND users.id NOT IN (
												SELECT blocker FROM blocked WHERE blocked = ? 
											UNION 
												SELECT blocked FROM blocked WHERE blocker = ?)`
	return db.query(request, [id, id, id])
}

// Update Seen √ Notif 

const seenNotif = (id) => {
	let request = `UPDATE notifications SET is_read = 1 WHERE type != 'chat' AND id_to = ?`
	return db.query(request, [id])
}

// Seen Message notif

const seenMsgNotif = (conv_id, id_from) => {
	let request = `UPDATE notifications SET is_read = 1 WHERE type = 'chat' AND id_conversation = ? AND id_from != ?`
	return db.query(request, [conv_id, id_from])
}


module.exports = {
	insertNotifVis,
	insertNotif,
	delNotif,
	insertNotifConv,
	getNotif,
	seenNotif,
	seenMsgNotif
}
