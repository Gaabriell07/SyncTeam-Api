const UserRepository = require('../../infrastructure/repositories/UserRepository')

class GetUser {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async execute(id) {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }
    return user
  }
}

module.exports = GetUser
