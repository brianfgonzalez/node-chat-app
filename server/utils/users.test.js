var expect = require('expect')
var {Users} = require('./users')
describe('Users', () => {
  it('should construct an empty Users array', () => {
    var users = new Users()
    expect(typeof users).toBe('object')
    expect(users.users).toEqual([])
  })
  it('should add/push a user object to the end Users array', () => {
    var user = {
      id: 12,
      name: 'Brian',
      room: 'Gonzalez'
    }
    var retuser = users.users.addUser(user)
    expect(retuser.name).toBe('Brian')
    expect(retuser.room).toBe('Gonzalez')
  })
})
