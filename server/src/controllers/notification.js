const notifModel = require('../models/notificationsModel')

// Insert Notificiation 

const insertChatNotif = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	if (!req.body.id_from || isNaN(req.body.id_from))
		return res.json({ msg: 'Invalid request' })
	if (!req.body.id_to || isNaN(req.body.id_to))
		return res.json({ msg: 'Invalid request' })
	if (!req.body.id_conversation || isNaN(req.body.id_conversation))
		return res.json({ msg: 'Invalid request' })
	if (!req.body.type)
		return res.json({ msg: 'Invalid request' })
	try {
		await notifModel.insertNotifConv(req.body.type, req.body.id_from, req.body.id_to, req.body.id_conversation)
		res.json({ ok: true })
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// Get All notification 

const getAllNotif = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'not logged in' })
	try {
		let result = await notifModel.getNotif(req.user.id)
		result = result.filter((cur, i) => {
			for (let index = 0; index < result.length; index++) {
				if (i != index && result[index].id == cur.id) {
					return cur.profile
				}
			}
			return true
		}).map(cur => {
			if (cur.cover)
				cur.profile_image = ''
			return cur
		})
		res.json(result)
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// Update notif if seen by user

const updateNotif = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	try {
		await notifModel.seenNotif(req.user.id)
		res.json({ ok: true })
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

module.exports = {
	insertChatNotif,
	getAllNotif,
	updateNotif
}