const userModel = require('../models/userModel')

// Update user location 

const updatePosition = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'not logged in' })
	if (!req.body.lat || !req.body.lng || isNaN(req.body.lat) || isNaN(req.body.lng))
		return res.json({ msg: 'Invalid request' })
	try {
		const result = await userModel.updateLocation(req.body.lat, req.body.lng, req.user.id)
		if (!result.affectedRows)
			return res.json({ msg: 'Oups something went wrong' })
		res.json({ ok: true })
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}
module.exports = updatePosition