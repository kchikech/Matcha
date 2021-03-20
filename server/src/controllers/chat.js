const chatModel = require('../models/chatModel')
const notifModel = require('../models/notificationsModel')
const validator = require('../utility/validator')
// Get  conveersation (all )

const getConAll = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	try {
		let result = await chatModel.getConvAll(req.user.id)
		result = result.filter((cur, i) => {
			for (let j = 0; j < result.length; j++) {
				if (i != j && result[j].user_id == cur.user_id)
					return cur.profile
			}
			return true
		})
		res.json(result)
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

//  get messages / Seen √ / notif 

const getMessages = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	if (!req.body.id || isNaN(req.body.id))
		return res.json({ msg: 'Invalid request' })
	if (typeof req.body.page === 'undefined')
		return res.json({ msg: 'Invalid request' })
	const page = req.body.page
	try {
		const result = await chatModel.getChat(req.body.id, page * 50)
		res.json(result.reverse())
		await chatModel.seenMsg(req.body.id, req.user.id)
		await notifModel.seenMsgNotif(req.body.id, req.user.id)
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// Updat conv 

const updateConv = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	if (!req.body.id || isNaN(req.body.id))
		return res.json({ msg: 'Invalid request' })
	try {
		await chatModel.seenMsg(req.body.id, req.user.id)
		await notifModel.seenMsgNotif(req.body.id, req.user.id)
		res.json({ ok: true })
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// Send Messages 

const sendMsg = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	if (!req.body.id_conversation || isNaN(req.body.id_conversation))
		return res.json({ msg: 'Invalid request' })
	if (!req.body.id_from || isNaN(req.body.id_from))
		return res.json({ msg: 'Invalid request' })
	if (!validator(req.body.message, 'msg'))
		return res.json({ msg: 'Invalid message' })
	try {
		const msg = {
			id_conversation: req.body.id_conversation,
			id_from: req.body.id_from,
			message: req.body.message.trim(),
			date: new Date().toISOString().substr(0, 19)
		}
		if (msg.message.length > 2048)
			return res.json({ msg: 'Message too long' })
		let result = await chatModel.getConversation(msg.id_conversation, msg.id_from, msg.id_from)
		if (!result.length)
			return res.json({ msg: 'Bad conversation' })
		await chatModel.insertMsg(msg)
		await chatModel.updateConv(msg.date, result.insertId, msg.id_conversation)
		res.json({ ok: true })
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}
module.exports = {
	getConAll,
	getMessages,
	updateConv,
	sendMsg
}