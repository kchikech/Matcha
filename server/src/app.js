require('dotenv').config()
let bodyParser = require('body-parser')
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

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb', extended: true }))

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')

// routes 

app.use('/api/users/', require('./routes/userRoutes'))
app.use('/api/auth/', require('./routes/authRoutes'))
app.use('/api/browse/', require('./routes/browsingRoutes'))
app.use('/api/chat/', require('./routes/chatRoutes'))
app.use('/api/notif/', require('./routes/notifRoutes'))
app.use('/api/matching/', require('./routes/matchingRoutes'))


const server = http.createServer(app)

server.listen(port, () => console.log(`The server has started on port -> ${port}`))
