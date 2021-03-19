const express = require('express')
const routes = express.Router()
const register = require('../controllers/register')
const auth = require('../controllers/auth')
const authCheck = require('../middleware/auth')
const forgot = require('../controllers/forget_password')
const userProfile = require('../controllers/profile')
const multer = require('multer')
const upload = multer({ limits: { fileSize: 4 * 1024 * 1024 } })

// const isLoggedIn = require('../cont')



// Public Access

routes.post('/add', (register.register))

routes.get('/verify/:key', (register.verifyEmail))
routes.post('/login', auth.login)

routes.post('/forget_password', forgot.forget_password)
routes.get('/recover/:key', forgot.recover_password)
routes.post('/rkeycheck', authCheck, forgot.check_key) /* Private =>>> to check for later */
routes.post('/destroykey', authCheck, forgot.destroy_key) /* Private =>>> to check for later */
routes.post('/changefpassword', authCheck, forgot.change_password) /* Private =>>> to check for later */

// Private access [Needs login] 

routes.post('/updateprofile', authCheck, userProfile.updateProfile)
routes.post('/changeemail', authCheck, userProfile.changeEmail)
routes.post('/changepassword', authCheck, userProfile.changePassword)

// upload images 

routes.post('/image', [authCheck, upload.single('image')], userProfile.uploadImages)
routes.post('/image/cover', [authCheck, upload.single('image')], userProfile.uploadCover)
routes.post('/image/del', authCheck, userProfile.deleteImage)


routes.get('/logout', authCheck, auth.logout)
routes.get('/isLoggedin', authCheck, auth.isLoggedIn)



module.exports = routes
