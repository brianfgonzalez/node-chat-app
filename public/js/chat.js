var socket = io()

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

socket.on('connect', () => {
  console.log('Connected to server')
  var params = jQuery.deparam(window.location.search)

  socket.emit('join', params, function (err) {
      if (err) {
          alert(err)
          window.location.href = '/'
      } else {
        console.log('No error')
      }
  })
})

socket.on('disconnect', function () {
  console.log('Disconnected from server')
})

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a')
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

  var li = jQuery('<li></li>')
  var a = jQuery('<a target="_blank">My current location</a>')
  li.text(`${message.from} ${formattedTime}: `)
  a.attr('href', message.url)
  li.append(a)
  jQuery('#messages').append(li)
  scrollToBottom()
})

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault()
  var messageTextBox = jQuery('[name=message]')

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {
    messageTextBox.val('')
  })
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
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, function (e) {
    locationButton.prop("disabled", false).html('Send location')
    alert('Unable to fetch location',e)
  })
})
