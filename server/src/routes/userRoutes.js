const express = require('express')
const routes = express.Router()
const register = require('../controllers/register')
const auth = require('../controllers/auth')
const authCheck = require('../middleware/auth')
const forgot = require('../controllers/forget_password')
const userProfile = require('../controllers/profile')
const browsing = require('../controllers/browsing')
const block = require('../controllers/block')
const location = require('../controllers/location')
const multer = require('multer')
const upload = multer({ limits: { fileSize: 4 * 1024 * 1024 } })

routes.post('/add', register.register)

routes.get('/verify/:key', register.verifyEmail)

routes.post('/updateprofile', authCheck, userProfile.updateProfile)
routes.post('/changeemail', authCheck, userProfile.changeEmail)
routes.post('/changepassword', authCheck, userProfile.changePassword)

// routes.get('/show', authCheck, browsing.showUsers)
// routes.get('/show/:id', authCheck, browsing.showUserById)

routes.post('/show', authCheck, browsing.showUsers)
routes.get('/show/:id', authCheck, browsing.showUserById)

routes.post('/report', authCheck, block.reportUser)
routes.post('/block', authCheck, block.blockUser)
routes.post('/unblock', authCheck, block.unblockUser)
routes.get('/getblocked', authCheck, browsing.getBlocked)
routes.post('/blacklisted', authCheck, userProfile.blacklisted)

routes.post('/location', authCheck, location)

routes.post('/image', [authCheck, upload.single('image')], userProfile.uploadImages)
routes.post('/image/cover', [authCheck, upload.single('image')], userProfile.uploadCover)
routes.post('/image/del', authCheck, userProfile.deleteImage)

module.exports = routes
