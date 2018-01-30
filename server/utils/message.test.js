var expect = require('expect')
var {generateMessage} = require('./message')
describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    //store response in variable
    var res = generateMessage('brian@aol.com', 'Hey this is brian, how goes it?')
    expect(res.from).toBe('brian@aol.com')
    expect(res.text).toBe('Hey this is brian, how goes it?')
    expect(typeof res.createdAt).toBe('number')
  })
})
