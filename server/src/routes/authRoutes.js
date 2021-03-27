const express = require('express')
const routes = express.Router()
const auth = require('../controllers/auth')
const authCheck = require('../middleware/auth')
const forgot = require('../controllers/forget_password')



routes.post('/login', auth.login)
routes.get('/logout', authCheck, auth.logout)
routes.get('/isLoggedin', authCheck, auth.isLoggedIn)
routes.post('/forget_password', forgot.forget_password)
routes.get('/recover/:key', forgot.recover_password)
routes.post('/rkeycheck', authCheck, forgot.check_key)
routes.get('/destroykey', authCheck, forgot.destroy_key)

module.exports = routes
