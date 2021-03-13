const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const sign = promisify(jwt.sign)
const auth = require('../middleware/auth')
const mailer = require('../utility/mail')
const validator = require('../utility/validator')
const htmlspecialchars = require('htmlspecialchars')
const userModel = require('../models/userModel')
const tagsModel = require('../models/tagsModel')
const { randomBytes } = require('crypto')
const { AsyncResource } = require('async_hooks')

const randomHex = () => randomBytes(10).toString('hex')
const tokenExp = { expiresIn: 7200 }

// Update user profile 

const updateProfile = async (req, res) => {
	if (!req.user.id) return res.json({ msg: 'Not logged in' })
	if (!validator(req.body.first_name, 'fname'))
		return res.json({ msg: 'First name is invalid' })
	if (!validator(req.body.last_name, 'lname'))
		return res.json({ msg: 'Last name is invalid' })
	if (!validator(req.body.email, 'email'))
		return res.json({ msg: 'Email is invalid' })
	if (!validator(req.body.username, 'username'))
		return res.json({ msg: 'Username is invalid' })
	if (!validator(req.body.gender, 'gender'))
		return res.json({ msg: 'Gender is invalid' })
	if (!validator(req.body.looking, 'looking'))
		return res.json({ msg: 'Looking is invalid' })
	if (req.body.birthdate && new Date(req.body.birthdate) >= new Date().getTime())
		return res.json({ msg: 'Birthdate is invalid' })
	let Tags
	if (req.body.tags)
		Tags = req.body.tags.split(',')
	else
		Tags = []
	if (Tags.length > 20) return res.json({ msg: 'Too many tags' })
	for (const iterator of Tags) {
		if (iterator.length > 25)
			return res.json({ msg: 'Tags are invalid' })
	}
	try {
		await userModel.getUserById(req.user.id, async (result) => {
			if (result.length) {
				const user = {
					first_name: req.body.first_name,
					last_name: req.body.last_name,
					username: req.body.username,
					email: req.body.email,
					gender: req.body.gender,
					looking: req.body.looking,
					birthdate: req.body.birthdate,
					biography: req.body.biography,
					tags: req.body.tags,
					adress: req.body.adress,
					city: req.body.city,
					country: req.body.country,
					postal_code: req.body.postal_code,
					phone: req.body.phone,
					id = req.user.id
				}
				await userModel.updateProfile(user, async (results) => {
					if (result.affectedRows) {
						res.json({ ok: true, status: 'User Updated' })
					}
					await tagsModel.getTags((result) => {
						const tags = result.map(cur => cur.value)
						user.tags.split(',').forEach(async element => {
							if (!tags.includes(element)) {
								try {
									await tagsModel.insertTags([element])
								} catch (err) {
									return res.json({ msg: 'Fatal error', err })
								}
							}
						})
					})

				})
			} else {
				res.json({ ok: false, status: 'User not found' })
			}
		})
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

module.exports = {
	updateProfile
}