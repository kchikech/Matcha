const express = require('express')
const routes = express.Router()
const authCheck = require('../middleware/auth')
const notif = require('../controllers/notification')


routes.post('/add', authCheck, notif.insertChatNotif)
routes.post('/update', authCheck, notif.updateNotif)
routes.get('/all', authCheck, notif.getAllNotif)

module.exports = routes
