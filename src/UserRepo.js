class UserRepo {
  constructor(data) {
    this.data = data;
  }
  
  returnUser(name) {
    return this.data.users.find(user => user.name === name);
  }

  returnFilteredUsers(value) {
    return this.data.users.filter(user => user.name.toLowerCase().includes(value.toLowerCase()));
  }

  createNewUser(name) {
    const ids = this.data.users.map(user => user.id);
    const newUser = { id: Math.max(...ids) + 1, name: name };
    this.data.users.push(newUser);
    return newUser;
  }
}

export default UserRepo;