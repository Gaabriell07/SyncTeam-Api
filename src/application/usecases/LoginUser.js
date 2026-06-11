const UserRepository = require('../../infrastructure/repositories/UserRepository')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class LoginUser {
  constructor() {
    this.userRepository = new UserRepository()
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret'
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '7d' })

    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token
    }
  }
}

module.exports = LoginUser
