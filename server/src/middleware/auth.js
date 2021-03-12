const jwt = require('jsonwebtoken')
const pool = require('../utility/database')
const userModel = require('../models/userModel')

const auth = async (req, res, callback) => {
	const token = req.header('x-auth-token')
	if (!token) return res.json({ msg: 'No token, authorizaton denied' })
	try {
		const decoded = jwt.verify(token, process.env.SECRET)
		req.user = decoded
		if (decoded.id) {
			try {
				userModel.getUserById(decoded.id, (result) => {
					if (result.length)
						req.user = result[0]
				})
			} catch (err) {
				console.log('Got error here -->', err)
			}
		}
		callback()
	} catch (e) {
		res.json({ msg: 'Token is not valid' })
	}
}

module.exports = auth
