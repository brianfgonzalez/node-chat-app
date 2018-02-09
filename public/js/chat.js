// var socket = io({
//   rememberTransport: false,
//   transports: ['websocket', 'polling']
//   })
var socket = io()
var params = jQuery.deparam(window.location.search)

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages')
  var newMessage = messages.children('li:last-child')

  // Heights
  var clientHeight = messages.prop('clientHeight')
  var scrollTop = messages.prop('scrollTop')
  var scrollHeight = messages.prop('scrollHeight')
  var newMessageHeight = newMessage.innerHeight()
  var lastMessageHeight = newMessage.prev().innerHeight()

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight)
  }
}

socket.on('connect', function () {
  console.log(params.name+'attempting to connect to the'+params.room)
  socket.emit('join', params, function (err) {
      if (err) {
          alert(err);
          window.location.href = '/'
      } else {
        console.log('No error')
      }
  })
})

socket.on('disconnect', function () {
  console.log(params.name,'disconnected from server')
})

socket.on('updateUsersList', function (users) {
  jQuery('#users').html('<ul>')
  users.forEach(function (user) {
    var html = '<li>'+user+'</li>'
    jQuery('#users').append(html)
  })
  jQuery('#users').append('</ul>')
})

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a')
  console.log('in newMessage',moment().format('h:mm:ss a'))
  var template = jQuery('#message-template').html()
  var html = Mustache.render(template, {
    user: message.from,
    time: formattedTime,
    text: message.text
  })
  jQuery('#messages').append(html)
  scrollToBottom()
})

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a')
  var template = jQuery('#locationmessage-template').html()
  var html = Mustache.render(template, {
    user: message.from,
    time: formattedTime,
    text: message.url
  })
  jQuery('#messages').append(html)
  scrollToBottom()
})

var messageButton = jQuery('#send-message')
jQuery('#message-form').submit(function (e) {
  e.preventDefault()
  console.log('in formSubmit',moment().format('h:mm:ss a'))
  var messageTextBox = jQuery('[name=message]')
  if (!(messageTextBox.val().trim().length === 0)) {
    messageButton.prop("disabled", "disabled").html('Sending message...')
    socket.emit('createMessage', {
      from: params.name,
      text: messageTextBox.val(),
      room: params.room
    }, function () {
      console.log('in callBack',moment().format('h:mm:ss a'))
      messageTextBox.val('')
      messageButton.prop("disabled", false).html('Send')
    })
  }
})

var locationButton = jQuery('#send-location')
locationButton.on('click', function () {
  locationButton.prop("disabled", "disabled").html('Sending location...')
  //using https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.')
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.prop("disabled", false).html('Send location')
    socket.emit('createLocationMessage', {
      from: params.name,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
    }, function (e) {
      locationButton.prop("disabled", false).html('Send location')
      alert('Unable to fetch location',e)
    })
})
