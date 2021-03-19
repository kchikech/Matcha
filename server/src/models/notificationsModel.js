const db = require('../utility/database')
 
// INSERT INTO Notif [visit]

const insertNotifVis = (user_id, id) => {
	let request = `INSERT INTO notifications (type, id_from, id_to) VALUES ('visit', ?, ?)`
	return db.query(request, [user_id, id])
}

// Inset notif (variable type)

const insertNotif = (type, users) => {
	let request = `INSERT INTO notifications (type, id_from, id_to) VALUES (?, ?, ?)`
	return db.query(sql, [type, ...users])
}

// Delete notificaton 

const delNotif = (id, user_id) => {
	let request = `DELETE FROM notifications WHERE (id_from = ? AND id_to = ?) OR (id_from = ? AND id_to = ?)`
	return db.query(request, [id, user_id, id, user_id])
}
module.exports = {
	insertNotifVis,
	insertNotif,
	delNotif
}
