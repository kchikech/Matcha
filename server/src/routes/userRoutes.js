const express = require('express')
const routes = express.Router()
const register = require('../controllers/register')
const auth = require('../controllers/auth')
const authCheck = require('../middleware/auth')
const forgot = require('../controllers/forget_password')
const userProfile = require('../controllers/profile')
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

// change_password
// Private access [Needs login] 

routes.post('/updateprofile', authCheck, userProfile.updateProfile)
routes.post('/changeemail', authCheck, userProfile.changeEmail)
routes.post('/changepassword', authCheck, userProfile.changePassword)


routes.get('/logout', authCheck, auth.logout)


module.exports = routes
