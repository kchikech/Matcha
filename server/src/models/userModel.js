const db = require('../utility/database')

// add user

const addUser = (user, callback) => {
	let request = `INSERT INTO users (first_name, last_name, username, email, password, vkey) VALUES
								('${user.first_name}',
								'${user.last_name}',
								'${user.username}',
								'${user.email}',
								'${user.password}',
								'${user.vkey}')`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Get user by Username / email 

const getUser = (user, callback) => {
	let request = `SELECT email, username FROM users WHERE username = '${user.username}' OR email = '${user.email}'`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Get user by Username / email 

const getUserByemail = (email, callback) => {
	let request = `SELECT email, username FROM users WHERE email = '${email}'`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}


// Check Verif key 

const getVkey = (vkey, callback) => {
	let request = `SELECT verified, id FROM users WHERE vkey = '${vkey}'`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Add Reset password  key  [rkey] ---- Using Email 

const addRkey = (user, callback) => {
	let request = `UPDATE users SET rkey = '${user.rkey}' where email = '${user.email}'`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Destroy password  key  [rkey] ---- Using Email 

const destroyRkey = (id, callback) => {
	let request = `UPDATE users SET rkey = '' where id = '${id}'`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Update password [After forgotten Email]

const changeFrogottenPassword = (user, callback) => {
	let request = `UPDATE users SET password = '${user.password}', rkey = '' WHERE id = '${user.id}' AND rkey = '${user.rkey}'`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}


// Check Reset password  key  [rkey]

const getRkey = (rkey, callback) => {
	let request = `SELECT id FROM users WHERE rkey = '${rkey}'`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}


// Validate an Email 

const validateEmail = (vkey, callback) => {
	let request = `UPDATE users SET verified = 1 WHERE vkey = '${vkey}' AND verified = 0`
	db.query(request, (error) => {
		if (error) throw error
		callback()
	})
}

// Get user data by ID

const getUserById = (id, callback) => {
	let request = `SELECT * from users WHERE id= ? `
	db.query(request, [id], (error, results) => {
		if (error) throw error
		callback(results)
	})
}

const getUserByIdD = (id) => {
	let request = `SELECT * from users WHERE id= ? `
	return db.query(request, [id])
}


// Get user data by Username 

const getUserByUsername = (username, callback) => {
	let request = `SELECT * from users WHERE username='${username}'`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Filling information for the 1st time 

const updateProfile = (user, callback) => {
	let request = ` UPDATE users SET 
									first_name = ?,
									last_name = ?,
									username = ?,
									email = ?,
									gender = ?,
									looking = ?,
									birthdate = ?,
									biography = ?, 
									tags = ?,
									\`address\` = ?,
									city = ?,
									country = ?,
									postal_code = ?,
									phone = ?
									WHERE id = ?
	`
	db.query(request, Object.values(user), (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Update user Email 

const changeEmail = (user, callback) => {
	let request = `UPDATE users SET email = '${user.email}' WHERE id = '${user.id}'`
	db.query(request, (error, result) => {
		if (error) throw error
		callback(result)
	})
}

// Update Password 

const changePassword = (user, callback) => {
	let request = `UPDATE users SET password = '${user.password}' WHERE id = '${user.id}'`
	db.query(request, (error, result) => {
		if (error) throw error
		callback(result)
	})
}

// Get images 

const getImages = (id, callback) => {
	let request = `SELECT * FROM images WHERE user_id = ${id} AND cover = 0`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Get image By Id

const getImagesById = (id, user_id, callback) => {
	let request = `SELECT * FROM images WHERE id = ${id} AND user_id = ${user_id} `
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}


// Add images 

const insertImages = (user, callback) => {
	let request = `INSERT INTO images (user_id, name, profile) VALUES (${user.id}, '${user.imgName}', 1)`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Update profile pic to 0

const updateProfilePic = (id) => {
	let request = `UPDATE images SET profile = 0 WHERE user_id = ${id}`
	db.query(request, (error) => {
		if (error) throw error
	})
}

// Get cover photo

const getCover = (id, callback) => {
	let request = `SELECT * FROM images WHERE cover = 1 AND user_id = ${id}`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// Delete cover photo 

const delCover = (id, user_id) => {
	let request = `DELETE FROM images WHERE id = ${id} AND user_id = ${user_id}`
	db.query(request, (error) => {
		if (error) throw error
	})
}

// INSERT Cover photo

const insertCover = (user_id, imgName, callback) => {
	let request = `INSERT INTO images (user_id, name, cover) VALUES (${user_id}, '${imgName}', 1)`
	db.query(request, (error, results) => {
		if (error) throw error
		callback(results)
	})
}

// DELETE images 

const delImage = (id, user_id, callback) => {
	let request = `DELETE FROM images WHERE id = ${id} AND user_id = ${user_id}`
	db.query(request, (error) => {
		if (error) throw error
	})
}

module.exports = {
	addUser,
	getUser,
	getVkey,
	validateEmail,
	getUserById,
	getUserByUsername,
	getUserByemail,
	getRkey,
	addRkey,
	destroyRkey,
	changeFrogottenPassword,
	updateProfile,
	changeEmail,
	getUserByIdD,
	changePassword,
	insertImages,
	getImages,
	updateProfilePic,
	getCover,
	delCover,
	insertCover,
	getImagesById
}