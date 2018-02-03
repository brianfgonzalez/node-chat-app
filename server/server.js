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
var {isRealString} = require('./utils/validation')

app.use(express.static(publicPath))

//io emits to all sessions (users)
//socket emits to only one session

io.on('connection', (socket) => {
  console.log('New user connected')

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and Room name are required.')
    }
    socket.join(params.room)
    //socket.leave('nameofroom')

    //io.emit => sends to everyone => io.to('nameofroom').emit
    //socket.broadcast.emit => sends to everyone but the current user => socket.broadcast.to('nameofroom').emit
    //socket.emit => sends to specific user

    socket.emit('newMessage', generateMessage('Admin', `Welcome to the ${params.room} room`))
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`))
    callback()
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message)
    io.emit('newMessage', generateMessage(message.from, message.text))
    callback()
  })

  socket.on('createLocationMessage', (coords, callback) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  })
})

// bind app to local port calls http.createServer
server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
