const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io').listen(server)
require('./models/connections')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'build')))

require('./auth/passport')

app.use('/api', require('./routes'))

app.use('*', (_req, res) => {
    const file = path.resolve(__dirname, 'build', 'index.html')
    res.sendFile(file)
})

app.use((err, _, res, __) => {
    console.log(err.stack)
    res.status(500).json({
        statusMessage: 'Error',
        data: { status: 500, message: err.message },
    })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, function () {
    console.log('Environment', process.env.NODE_ENV)
    console.log(`Server running. Use our API on port: ${PORT}`)
})

const connectedUsers = {}
const historyMessage = {}

io.on('connection', (socket) => {
    const socketId = socket.id
    socket.on('users:connect', function (data) {
        const user = { ...data, socketId, activeRoom: null }
        connectedUsers[socketId] = user
        socket.emit('users:list', Object.values(connectedUsers))
        socket.broadcast.emit('users:add', user)
    })
    socket.on('message:add', function (data) {
        const { senderId, recipientId } = data
        socket.emit('message:add', data)
        socket.broadcast.to(data.roomId).emit('message:add', data)
        addMessageToHistory(senderId, recipientId, data)
        addMessageToHistory(recipientId, senderId, data)
    })
    socket.on('message:history', function (data) {
        if (
            historyMessage[data.userId] &&
            historyMessage[data.userId][data.recipientId]
        ) {
            socket.emit(
                'message:history',
                historyMessage[data.userId][data.recipientId],
            )
            console.log(historyMessage[data.userId][data.recipientId])
        }
    })
    socket.on('disconnect', function (data) {
        delete connectedUsers[socketId]
        socket.broadcast.emit('users:leave', socketId)
    })
})

const addMessageToHistory = (senderId, recipientId, data) => {
    if (historyMessage[senderId]) {
        if (historyMessage[senderId][recipientId]) {
            if (historyMessage[senderId][recipientId].length > 10) {
                historyMessage[senderId][recipientId].shift()
            }
            historyMessage[senderId][recipientId].push(data)
        } else {
            historyMessage[senderId][recipientId] = []
            historyMessage[senderId][recipientId].push(data)
        }
    } else {
        historyMessage[senderId] = {}
        historyMessage[senderId][recipientId] = []
        historyMessage[senderId][recipientId].push(data)
    }
}
module.exports = { app: app, server: server }
