const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const validator = require('../utility/validator')
const userModel = require('../models/userModel')
const tagsModel = require('../models/tagsModel')
const { randomBytes } = require('crypto')
const { AsyncResource } = require('async_hooks')
const { dirname, resolve } = require('path')

const { readFile, writeFile, unlink } = require('fs')
const writeFileAsync = promisify(writeFile)
const unlinkAsync = promisify(unlink)

const randomHex = () => randomBytes(10).toString('hex')
const isExternal = url => url && (url.indexOf(':') > -1 || url.indexOf('//') > -1 || url.indexOf('www.') > -1)
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
	if (!validator(req?.body?.phone, 'phone'))
		return res.json({ msg: 'Phone number is invalid' })
	if (req.body.birthdate && new Date(req.body.birthdate) >= new Date().getTime())
		return res.json({ msg: 'Birthdate is invalid' })
	if (req?.body?.biography?.length > 500)
		return res.json({ msg: 'bio is too large' })
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
					address: req.body.address,
					city: req.body.city,
					country: req.body.country,
					postal_code: req.body.postal_code,
					phone: req.body.phone,
					id: req.user.id
				}
				await userModel.updateProfile(user, async (results) => {
					if (results.affectedRows) {
						res.json({ ok: true, status: 'User Updated' })
					}
					await tagsModel.getTags((result) => {
						const tags = result.map(cur => cur.value)
						if (user.tags) {
							user.tags.split(',').forEach(async element => {
								if (!tags.includes(element)) {
									try {
										await tagsModel.insertTags([element])
									} catch (err) {
										return res.json({ msg: 'Fatal error', err })
									}
								}
							})
						}
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


// Change Email 

const changeEmail = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	if (!validator(req.body.email, 'email'))
		return res.json({ msg: 'Email is invalid' })
	if (!validator(req.body.password, 'password'))
		return res.json({ msg: 'Password is invalid' })
	if (req.user.email == req.body.email)
		return res.json({ msg: 'The provided email matches your current email' })
	try {
		let hash = await bcrypt.compare(req.body.password, req.user.password)
		if (!hash)
			res.json({ msg: 'Wrong password' })
		await userModel.getUserByemail(req.body.email, async (result) => {
			if (result.length)
				return res.json({ msg: 'Email already exists' })
			let user = {
				id: req.user.id,
				email: req.body.email
			}
			await userModel.changeEmail(user, (result) => {
				if (!result.affectedRows)
					return res.json({ msg: 'Oups something went wrong' })
				res.json({ ok: true })
			})
		})
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// Change password ~ 

const changePassword = async (req, res) => {
	if (!req.user.id) return res.json({ msg: 'Not logged in' })
	if (!validator(req.body.password, 'password'))
		return res.json({ msg: 'Password is invalid' })
	if (!validator(req.body.newPassword, 'password'))
		return res.json({ msg: 'New password is invalid' })
	if (!req.body.confNewPassword || req.body.newPassword != req.body.confNewPassword)
		return res.json({ msg: 'Confirmation password is invalid' })
	if (req.body.password == req.body.newPassword)
		return res.json({ msg: 'The provided password matches your current password' })
	try {
		let hash = await bcrypt.compare(req.body.password, req.user.password)
		if (!hash)
			return res.json({ msg: 'Wrong password' })
		const password = await bcrypt.hash(req.body.newPassword, 10)
		let user = {
			password: password,
			id: req.user.id
		}
		await userModel.changePassword(user, (result) => {
			if (!result.affectedRows)
				return res.json({ msg: 'Oups something went wrong' })
			res.json({ ok: true })
		})
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// Upload images 

const uploadImages = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	try {
		const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '')
		const uploadDir = `${dirname(dirname(__dirname))}/uploads/`
		const imgName = `${req.user.id}-${randomHex()}.png`

		userModel.getImages(req.user.id, async (result) => {
			if (result.length < 5) {
				await writeFileAsync(uploadDir + imgName, base64Data, 'base64')
				let user = {
					id: req.user.id,
					imgName: imgName
				}
				userModel.updateProfilePic(req.user.id)
				userModel.insertImages(user, (result) => {
					userModel.setImages(req.user.id)
					res.json({ ok: true, status: 'Image Updated', name: imgName, id: result.insertId, user_id: req.user.id })
				})
			} else {
				res.json({ msg: 'User already has 5 photos' })
			}
		})
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// Upload cover 

const uploadCover = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	try {
		await userModel.getCover(req.user.id, async (result) => {
			if (result.length) {
				if (!isExternal(result[0].name)) {
					try {
						unlinkAsync(resolve(dirname(dirname(__dirname)), 'uploads', result[0].name))
					} catch (err) {
						return res.json({ msg: 'Fatal error', err })
					}
				}
				await userModel.delCover(result[0].id, req.user.id)
			}
			const uploadDir = `${dirname(dirname(__dirname))}/uploads/`
			const imgName = `${req.user.id}-${randomHex()}.png`
			await writeFileAsync(uploadDir + imgName, req.file.buffer, 'base64')
			await userModel.insertCover(req.user.id, imgName, (result) => {
				if (!result.affectedRows)
					return res.json({ msg: 'Oups.. Something went wrong!' })
				res.json({ ok: true, status: 'Image Updated', name: imgName, id: result.insertId, user_id: req.user.id })
			})
		})
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// DELETE IMAGES

const deleteImage = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	if (!req.body.id || isNaN(req.body.id))
		return res.json({ msg: 'Invalid request' })
	try {
		await userModel.getImagesById(req.body.id, req.user.id, async (result) => {
			if (result.length) {
				if (!isExternal(result[0].name)) {
					try {
						await unlinkAsync(resolve(dirname(dirname(__dirname)), 'uploads', result[0].name))
					} catch (err) {
						return res.json({ msg: 'Fatal error', err })
					}
				}
				await userModel.delImage(req.body.id, req.user.id, async (result) => {
					if (!req.body.profile) {
						userModel.setImages(req.user.id)
					}
					if (result.affectedRows)
						return res.json({ ok: true })
				})
			}
			else {
				res.json({ msg: 'Oups something went wrong' })
			}
		})
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

const blacklisted = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'not logged in' })
	const blacklist = JSON.parse(req.body.ids)
	if (!Array.isArray(blacklist) || !blacklist.length)
		return res.json({ msg: 'bad query' })
	const placehoder = `(${blacklist.map(cur => '?').join(', ')})`
	try {
		const result = await userModel.blacklist(blacklist, placehoder)
		res.json({
			ok: true,
			list: result
		})
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}

}


module.exports = {
	updateProfile,
	changeEmail,
	changePassword,
	uploadImages,
	uploadCover,
	deleteImage,
	blacklisted
}