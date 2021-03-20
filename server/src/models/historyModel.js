const db = require('../utility/database')


// INSERT Into history [visits]

const insertHistory = (user_id, id) => {
	let request = `INSERT INTO history (visitor, visited) VALUES (?, ?)`
	return db.query(request, [user_id, id])
}

/// Get Visitore History 

const getVisitors = (user_id) => {
	let request = `SELECT
									history.visitor as visitor_id,
									history.created_at as visit_date,
									users.username as username,
									images.name as profile_image
								FROM history
									INNER JOIN users 
									ON 
										history.visitor = users.id
									INNER JOIN images
									ON 
										history.visitor = images.user_id
									WHERE 
										history.visited = ?
									AND
									 images.profile = 1`
	return db.query(request, [user_id])
}

// Get visited History 

const getVisited = (user_id) => {
	let request = `SELECT
									history.visited as visited_id,
									history.created_at as visit_date,
									users.username as username,
									images.name as profile_image
								FROM history
									INNER JOIN users 
									ON 
										history.visited = users.id
									INNER JOIN images
									ON 
										history.visited = images.user_id
									WHERE 
										history.visitor = ?
									AND 
										images.profile = 1`
	return db.query(request, [user_id])
}

module.exports = {
	insertHistory,
	getVisitors,
	getVisited
}