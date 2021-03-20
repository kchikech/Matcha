const userModel = require('../models/userModel')
const tagsModel = require('../models/tagsModel')

const notifModel = require('../models/notificationsModel')
const historyModel = require('../models/historyModel')

const matchingModel = require('../models/matchingModel')
const distance = require('../utility/distance')


// Show users (Global)

const showUsers = async (req, res) => {
	const user = req.user
	if (!user.id)
		return res.json({ msg: 'Not logged in' })
	try {
		let result = await userModel.getUserBrow()
		let userTags = user.tags
		const userLoc = {
			lat: user.lat,
			lng: user.lng
		}
		const commonTags = a => {
			if (!a || !a.length) return 0
			const tags = a.split(',')
			return userTags.split(',').filter(val => -1 !== tags.indexOf(val)).length
		}
		result = result.map(cur => {
			delete cur.password
			delete cur.vkey
			delete cur.rkey
			delete cur.verified
			delete cur.email
			delete cur.google_id
			return cur
		}).filter(cur => {
			if (!req.body.filter)
				return true
			if (user.looking == 'both')
				return cur.looking == 'both'
			if (user.looking != user.gender)
				return cur.looking != 'both' && cur.gender != user.gender && cur.gender != cur.looking
			if (user.looking == user.gender)
				return cur.looking != 'both' && cur.gender == user.gender && cur.gender == cur.looking
			return false
		}).sort((a, b) => {
			const aLoc = { lat: a.lat, lng: a.lng }
			const bLoc = { lat: b.lat, lng: b.lng }
			const disDelta = distance(userLoc, aLoc) - distance(userLoc, bLoc)
			if (!disDelta && userTags && userTags.length) {
				const disTag = commonTags(b.tags) - commonTags(a.tags)
				return !disTag ? b.rating - a.rating : disTag
			} else {
				return !disDelta ? b.rating - a.rating : disDelta
			}
		})
		res.json(result)
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// Show users by id 

const showUserById = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'Not logged in' })
	if (!req.params.id || isNaN(req.params.id))
		return res.json({ msg: 'Invalid request' })
	try {
		const result = await userModel.getUserbyIdBrow(req.params.id, req.user.id)
		if (result.length) {
			const user = result[0]
			delete user.password
			delete user.vkey
			delete user.rkey
			delete user.verified
			delete user.email
			delete user.google_id
			user.images = await userModel.getImagesByUid(user.id)
			await historyModel.insertHistory(req.user.id, req.params.id)
			await notifModel.insertNotifVis(req.user.id, req.params.id)
			res.json(user)
		} else {
			res.json({ msg: 'User doesnt exist' })
		}
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// get history of visits 

const getHistory = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'not logged in' })
	try {
		let visitors = await historyModel.getVisitors(req.user.id)
		visitors = visitors.filter((cur, i) => {
			for (let index = 0; index < visitors.length; index++) {
				if (i != index && visitors[index].username == cur.username)
					return cur.profile
			}
			return true
		})
		let visited = await historyModel.getVisited(req.user.id)
		visited = visited.filter((cur, i) => {
			for (let index = 0; index < visited.length; index++) {
				if (i != index && visited[index].username == cur.username)
					return cur.profile
			}
			return true
		})
		res.json([...visitors, ...visited])
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// Get tags 

const getTags = async (req, res) => {
	if (!req.user.id) 
		res.json({ msg: 'not logged in' })
	try {
		await tagsModel.getTags((result) => {
			res.json(result.map(cur => cur.value))
		})
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

// get Blocked users 

const getBlocked = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'not logged in' })
	try {
		const blacklist = await userModel.getBlocked(req.user.id)
		res.json(blacklist)
	}
	catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}


// Get matches

const getMatches = async (req, res) => {
	if (!req.user.id)
		return res.json({ msg: 'not logged in' })
	try {
		let following = await matchingModel.getFollowing(req.user.id)
		following = following.filter((cur, i) => {
			for (let index = 0; index < following.length; index++) {
				if (i != index && following[index].username == cur.username)
					return cur.profile
			}
			return true
		})
		let followers = await matchingModel.getFollowers(req.user.id)
		followers = followers.filter((cur, i) => {
			for (let index = 0; index < followers.length; index++) {
				if (i != index && followers[index].username == cur.username)
					return cur.profile
			}
			return true
		})
		res.json([...following, ...followers])
	} catch (err) {
		return res.json({ msg: 'Fatal error', err })
	}
}

module.exports = {
	showUsers,
	showUserById,
	getHistory,
	getTags,
	getBlocked,
	getMatches
}
