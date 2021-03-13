const db = require('../utility/database')
const { callbackPromise } = require('nodemailer/lib/shared')

// GET TAGS

const getTags = (callback) => {
	let request = `SELECT value FROM tags`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
} 


// INSERT TAGS 

const insertTags = (tag, callback) => {
	let request = `INSERT INTO tags (value) VALUES (?)`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

module.exports = {
	getTags,
	insertTags
}