const userModel = require('../models/userModel')
const notifModel = require('../models/notificationsModel')
const chatModel = require('../models/chatModel')
const matchModel = require('../models/matchingModel')

const pool = require('../utility/database')

// Match action 

const match = async (req, res) => {
	if (!req.user.id) return res.json({ msg: 'Not logged in' })
	if (typeof req.body.liked !== 'boolean' || !req.body.id || isNaN(req.body.id))
		return res.json({ msg: 'Invalid request' })
	try {
		let result
		if (req.body.liked) {
			await matchModel.delMatche(req.user.id, req.body.id)
			await chatModel.disallowConv(req.user.id, req.body.id)
			await notifModel.insertNotif('unlike', req.user.id, req.body.id)
			res.json({ ok: true })
		} else {
			result = await matchModel.getMatche(req.user.id, req.body.id)
			if (!result.length) {
				await matchModel.insertMatche(req.user.id, req.body.id)
				result = await matchModel.getMatche(req.body.id, req.user.id)
				if (result.length) {
					result = await chatModel.getConv(req.user.id, req.body.id)
					if (!result.length) {
						await chatModel.insertConv(req.user.id, req.body.id)
					} else if (result[0].allowed == 0) {
						await chatModel.allowConv(result[0].id_conversation)
					}
					await notifModel.insertNotif('like_back', req.user.id, req.body.id)
				} else {
					await notifModel.insertNotif('like', req.user.id, req.body.id)
				}
				res.json({ ok: true })
			} else {
				res.json({ msg: 'User already Matched' })
			}
		}
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

module.exports = {
	match
}
