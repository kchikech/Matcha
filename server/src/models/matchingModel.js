const db = require('../utility/database')


///  get Matches

const getFollowing = (user_id) => {
	let request = `SELECT
									matches.matched as matched_id,
									matches.created_at as match_date,
									users.username as username,
									images.name as profile_image,
									images.profile as profile
								FROM matches
								INNER JOIN users
								ON 
									matches.matched = users.id
								LEFT JOIN images
								ON 
									matches.matched = images.user_id
								WHERE 
									matches.matcher = ?`
	return db.query(request, [user_id])
}

const getFollowers = (user_id) => {
	let request = `SELECT
										matches.matcher as matcher_id,
										matches.created_at as match_date,
										users.username as username,
										images.name as profile_image,
										images.profile as profile
								FROM matches
								INNER JOIN users
								ON 
									matches.matcher = users.id
								LEFT JOIN images
								ON 
									matches.matcher = images.user_id
								WHERE matches.matched = ?`
	return db.query(request, [user_id])
}

// Make matching 

const insertMatche = (user1, user2) => {
	let request = `INSERT INTO matches (matcher, matched) VALUES (?, ?)`
	return db.query(request, [user1, user2])
}

// Delete matche 

const delMatche = (user_id, id) => {
	let request = `DELETE FROM matches where (matcher = ? AND matched = ?) OR (matcher = ? AND matched = ?)`
	return db.query(request, [user_id, id, id, user_id])
}

// Get match 

const getMatche = (user_id, id) => {
	let request = `SELECT * FROM matches where matcher = ? AND matched = ?`
	return db.query(request, [user_id, id])
}

module.exports = {
	getFollowing,
	getFollowers,
	insertMatche,
	delMatche,
	getMatche
}
