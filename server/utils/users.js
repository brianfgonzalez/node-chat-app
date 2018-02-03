//addUser(id,name,room)
//removeUser(id)
//getUser(id)
//getUserList(room)

// if function is supposed to be used with "new Person", name of function should be upper.

class Users {
  // constructor is called by default with args (initializing)
  constructor () {
    this.users = []
  }
  // create a method for class
  addUser (id,name,room) {
    var user = {id, name, room}
    this.users.push(user)
    return user
    //return `${this.name} is ${this.age} year(s) old`
  }
}

//var me = new Person('Brian', 25)
//console.log(me.getUserDescription())

module.exports = {Users}
