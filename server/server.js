const path = require('path')
const express = require('express')
const port = process.env.PORT || 3000
const socketIO = require('socket.io')
const http = require('http')
const publicPath = path.join(__dirname, '../public')

var app = express()
var server = http.createServer(app)
var io = socketIO(server)
var {generateMessage, generateLocationMessage} = require('./utils/message')

app.use(express.static(publicPath))

//io emits to all sessions (users)
//socket emits to only one session

io.on('connection', (socket) => {
  console.log('New user connected')

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'))
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message)
    io.emit('newMessage', generateMessage(message.from, message.text))
    callback('This is from the server')
  })

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  })
})

// bind app to local port calls http.createServer
server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
