var socket = io()

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('disconnect', function () {
  console.log('Disconnected from server')
})

socket.on('newMessage', function (message) {
  console.log('newMessage', message)
  var li = jQuery('<li></li>')
  li.text(`${message.from}: ${message.text}`)

  jQuery('#messages').append(li)
})

socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>')
  var a = jQuery('<a target="_blank">My current location</a>')
  li.text(`${message.from}: `)
  a.attr('href', message.url)
  li.append(a)
  jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault()
  console.log('jquery submit event found.')
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
