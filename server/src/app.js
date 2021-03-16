require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const path = require('path')
const http = require('http')
const socketIo = require('socket.io')
const port = process.env.PORT || 3000
const app = express()
const passport = require('passport')
const pool = require('./utility/database')
const ejs = require('ejs')
const mailv = require('./utility/mail')

app.use(passport.initialize())

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')

app.use('/api/users/', require('./routes/userRoutes'))

const server = http.createServer(app)

server.listen(port, () => console.log(`The server has started on port -> ${port}`))
