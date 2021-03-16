const db = require('../utility/database')

// GET TAGS

const getTags = (callback) => {
	let request = `SELECT value FROM tags`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}


// INSERT TAGS 

const insertTags = (tag) => {
	let request = `INSERT INTO tags (value) VALUES (?)`
	db.query(request, [tag], (error) => {
		if (error) throw error
	})
}

module.exports = {
	getTags,
	insertTags
}