var expect = require('expect')
var {Users} = require('./users')
describe('Users', () => {
  var users
  beforeEach(() => {
    users = new Users()
    users.users = [{
      id: 1,
      name: 'Mike',
      room: 'Node Course'
    },{
      id: 2,
      name: 'Julie',
      room: 'Node Course'
    },{
      id: 3,
      name: 'Brian',
      room: 'Gonzalez'
    }]
  })

  it('should construct an empty Users array', () => {
    var users = new Users()
    expect(typeof users).toBe('object')
    expect(users.users).toEqual([])
  })
  it('should add/push a user object to the end Users array', () => {
    users = new Users()
    var user = {
      id: 12,
      name: 'Brian',
      room: 'Gonzalez'
    }
    var retuser = users.addUser(user.id, user.name, user.room)
    expect(users.users[0].name).toBe('Brian')
    expect(users.users[0].room).toBe('Gonzalez')
  })

  it('should return names array for Node Course room', () => {
    var userList = users.getUserList('Node Course')
    expect(userList).toContain('Mike','Julie')
  })

  it('should return names array for Gonzalez room', () => {
    var userList = users.getUserList('Gonzalez')
    expect(userList).toContain('Brian')
  })

  it('should delete the Brian user by using this id', () => {
    var res = users.removeUser(3)
    expect(users.users).not.toContain('Brian')
  })

  // it('should query and find for a user by id and return its user object', () => {
  //   var resUser = users.getUser(3)
  //   console.log('query call',this.users)
  //   expect(resUser.name).toBe('Brian')
  // })

  it('should query and fail to find a missing user by id and return a 0', () => {
    var resUser = users.getUser(5)
    expect(resUser.length).toBe(0)
  })


})
