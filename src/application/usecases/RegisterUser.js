const UserRepository = require('../../infrastructure/repositories/UserRepository')
const bcrypt = require('bcrypt')

class RegisterUser {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async execute({ id, email, password, name }) {
    const existing = await this.userRepository.findByEmail(email)
    if (existing) {
      throw new Error('EMAIL_ALREADY_EXISTS')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.userRepository.create({ id, email, password: hashedPassword, name })
    // Remove password before returning
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}

module.exports = RegisterUser
