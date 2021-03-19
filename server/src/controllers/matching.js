const userModel = require('../models/userModel')
const notifModel = require('../models/notificationsModel')
const chatModel = require('../models/chatModel')
const matchModel = require('../models/matchingModel')

// Match action 

const match = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	if (typeof req.body.liked !== 'boolean' || !req.body.id || isNaN(req.body.id))
		return res.json({ msg: 'Invalid request' })
	try {
		let result
		const users = [req.user.id, req.body.id]
		if (req.body.liked) {
			await matchModel.delMatche(users)
			await chatModel.disallowConv(users)
			await notifModel.insertNotif('unlike', users)
			res.json({ ok: true })
		} else {
			result = await matchModel.getMatche(users)
			if (!result.length) {
				matchModel.insertMatche(users)
				result = matchModel.getMatche(users.reverse())
				if (result.length) {
					result = await chatModel.getConv(users)
					if (!result.length) {
						await chatModel.insertConv(users)
					} else if (result[0].allowed == 0) {
						await chatModel.allowConv(result[0].id_conversation)
					}
					await notifModel.insertNotif('like_back', users)
				} else {
					await notifModel.insertNotif('like', users)
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
