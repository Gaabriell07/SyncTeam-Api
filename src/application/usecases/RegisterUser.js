const UserRepository = require('../../infrastructure/repositories/UserRepository')

class RegisterUser {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async execute({ id, email, name }) {
    const existing = await this.userRepository.findByEmail(email)
    if (existing) {
      throw new Error('EMAIL_ALREADY_EXISTS')
    }

    const user = await this.userRepository.create({ id, email, name })
    return user
  }
}

module.exports = RegisterUser
