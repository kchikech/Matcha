const db = require('../utility/database')
 
// INSERT INTO Notif [visit]

const insertNotifVis = (user_id, id) => {
	let request = `INSERT INTO notifications (type, id_from, id_to) VALUES ('visit', ?, ?)`
	return db.query(request, [user_id, id])
}

// Inset notif (variable type)

const insertNotif = (type, users) => {
	let request = `INSERT INTO notifications (type, id_from, id_to) VALUES (?, ?, ?)`
	db.query(sql, [type, ...users])
}

module.exports = {
	insertNotifVis,
	insertNotif
}
