const express = require('express')
const routes = express.Router()
const authCheck = require('../middleware/auth')
const browsing = require('../controllers/browsing')


routes.get('/history', authCheck, browsing.getHistory)
routes.get('/tags', authCheck, browsing.getTags)

module.exports = routes
