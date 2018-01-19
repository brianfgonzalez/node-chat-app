const path = require('path')
  express = require('express')
  port = process.env.PORT || 3000
  socketIO = require('socket.io')
  http = require('http')

const publicPath = path.join(__dirname, '../public')

var app = express()
var server = http.createServer(app)
var io = socketIO(server)

app.use(express.static(publicPath))

//io emits to all sessions (users)
//socket emits to only one session

io.on('connection', (socket) => {
  console.log('New user connected')

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })

  socket.on('createMessage', (message) => {
    console.log('createMessage', message)
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })
  })
})

// bind app to local port calls http.createServer
server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
