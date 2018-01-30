var expect = require('expect')
var {generateMessage, generateLocationMessage} = require('./message')
describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    //store response in variable
    var res = generateMessage('brian@aol.com', 'Hey this is brian, how goes it?')
    expect(res.from).toBe('brian@aol.com')
    expect(res.text).toBe('Hey this is brian, how goes it?')
    expect(typeof res.createdAt).toBe('number')
  })
})

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'brian@aol.com'
    var latitude = '35.212973'
    var longitude = '-80.9097127'
    var res = generateLocationMessage(from, latitude, longitude)
    expect(res.from).toBe(from)
    expect(res.url).toBe(`https://www.google.com/maps?q=${latitude},${longitude}`)
    expect(typeof res.createdAt).toBe('number')
  })
})
