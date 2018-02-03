var expect = require('expect')
var {isRealString} = require('./validation')
describe('isRealString', () => {
  it('should verify that string is valid', () => {
    //store response in variable
    expect(isRealString('   ')).toBe(false)
    expect(isRealString('')).toBe(false)
    expect(isRealString('brian')).toBe(true)
  })
})
