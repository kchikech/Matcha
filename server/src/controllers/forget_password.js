const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const sign = promisify(jwt.sign)
// const auth = require('../middleware/auth')
const mailer = require('../utility/mail')
const validator = require('../utility/validator')
const htmlspecialchars = require('htmlspecialchars')
const userModel = require('../models/userModel')
const { randomBytes } = require('crypto')
const { AsyncResource } = require('async_hooks')

const randomHex = () => randomBytes(10).toString('hex')
const tokenExp = { expiresIn: 7200 }


// Sending  forget password email 

const forget_password = async (req, res) => {
	if (!validator(req.body.email, 'email'))
		return res.json({ msg: 'Email is invalid' })
	try {
		const key = randomHex()
		const user = {
			rkey: key,
			email: req.body.email
		}
		await userModel.addRkey(user, (results) => {
			if (!results.affectedRows)
				return res.json({ msg: 'Email not found' })
			else {
				mailer.sendMail(req.body.email, key, 'auth/recover')
				return res.json({ ok: true })
			}
		})
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// Recover password [after sending email]

const recover_password = async (req, res) => {
	if (!req.params.key)
		return res.json({ msg: 'Invalid request' })
	try {
		const rkey = req.params.key
		userModel.getRkey(rkey, async (result) => {
			if (!result.length)
				return res.redirect('/404')
			else {
				const payload = { id: result[0].id }
				const token = await sign(payload, process.env.SECRET, tokenExp)
				return res.status(200).render('recover', { token, rkey })
				// res.json({ msg: 'ok' })
			}
		})
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

/// Key check 

const check_key = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	if (!req.body.key)
		return res.json({ msg: 'Invalid request' })
	if (!validator(req.body.password, 'password'))
		return res.json({ msg: 'Password is invalid' })
	try {
		const hashed = await bcrypt.hash(req.body.password, 10)
		let user = {
			id: req.user.id,
			rkey: req.body.key,
			password: hashed,
		}
		const key = req.body.key
		await userModel.getRkey(key, async (result) => {
			if (!result.length)
				return res.json({ msg: 'Invalid key' })
			await userModel.changeFrogottenPassword(user, (result) => {
				if (!result.affectedRows)
					return res.json({ msg: 'Oups something went wrong' })
				res.json({ ok: true })
			})
		})
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}


/// Key destroy 

const destroy_key = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	try {
		await userModel.destroy_key(id, (result) => {
			if (!result.affectedRows)
				return res.json({ msg: 'Error' })
			res.json({ ok: true })
		})
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}


module.exports = {
	forget_password,
	recover_password,
	check_key,
	destroy_key,
}
