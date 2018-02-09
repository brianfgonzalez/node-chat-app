const path = require('path')
const express = require('express')
const port = process.env.PORT || 3000
//const socketIO = require('socket.io')
const socketIO = require('socket.io', {
  rememberTransport: false,
  transports: ['websocket', 'polling']
  })
const http = require('http')
const publicPath = path.join(__dirname, '../public')

var app = express()
var server = http.createServer(app)
var io = socketIO(server)
var {generateMessage, generateLocationMessage} = require('./utils/message')
var {isRealString} = require('./utils/validation')
var {Users} = require('./utils/users')
var users = new Users()
var moment = require('moment')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      console.log(`${params.name} connected`)
      return callback('Name and Room name are required.')
    }
    socket.join(params.room)
    users.removeUser(socket.id)
    users.addUser(socket.id, params.name, params.room)

    io.to(params.room).emit('updateUsersList', users.getUserList(params.room))
    socket.emit('newMessage', generateMessage('Admin', `Welcome to the ${params.room} room`))
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`))
    callback()
  })

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('updateUsersList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left the room`))
    }
  })

  socket.on('createMessage', (message, callback) => {
    console.log('in createMessage',moment().format('h:mm:ss a'))
    io.to(message.room).emit('newMessage', generateMessage(message.from, message.text))
    callback() //clears the text input box
  })

  socket.on('createLocationMessage', (message) => {
    io.emit('newLocationMessage', generateLocationMessage(message.from, message.latitude, message.longitude))
  })
})

// bind app to local port calls http.createServer
server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})

//io emits to all sessions (users)
//socket emits to only one session
//socket.leave('nameofroom')
//io.emit => sends to everyone => io.to('nameofroom').emit
//socket.broadcast.emit => sends to everyone but the current user => socket.broadcast.to('nameofroom').emit
//socket.emit => sends to specific user
