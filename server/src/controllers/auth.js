const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const sign = promisify(jwt.sign)
// const auth = require('../middleware/auth')
const sendMail = require('../utility/mail')
const validator = require('../utility/validator')
const htmlspecialchars = require('htmlspecialchars')
const userModel = require('../models/userModel')
const { randomBytes } = require('crypto')
const { use } = require('../routes/userRoutes')
const randomHex = () => randomBytes(10).toString('hex')

const tokenExp = { expiresIn: 7200 }

// Login

const login = async (req, res) => {
	const username = htmlspecialchars(req.body.username)
	const password = htmlspecialchars(req.body.password)

	if (!validator(username, 'username'))
		return res.json({ msg: 'Username is invalid' })
	if (!validator(password, 'password'))
		return res.json({ msg: 'Password is invalid' })
	try {
		await userModel.getUserByUsername(username, async (result) => {
			if (result.length === 0)
				return res.json({ msg: 'User not found' })
			if (result[0].verified === 0)
				return res.json({ msg: 'Unverified user. Please verify your account' })
			const user = result[0]
			try {
				const decoded = await bcrypt.compare(password, user.password)
				if (!decoded)
					return res.json({ msg: 'Wrong password' })
				delete user.password
				delete user.verified
				delete user.tokenExpiration
				userModel.getUserById(user.id, async () => {
					const payload = { id: user.id }
					user.token = await sign(payload, process.env.SECRET, tokenExp)
					return res.json(user)
				})
			} catch (err) {
				return res.json({ msg: 'Fatal error', err })
			}
		})
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// Logout 


module.exports = {
	login
}