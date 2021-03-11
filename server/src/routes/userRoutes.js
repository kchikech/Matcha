const express = require('express')
const routes = express.Router()
const register = require('../controllers/register')
const auth = require('../controllers/auth')

// Public Access

routes.post('/add', (register.register))
routes.get('/verify/:key', (register.verifyEmail))
routes.post('/login', auth.login)


// TEST

module.exports = routes
