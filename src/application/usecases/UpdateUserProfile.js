const UserRepository = require('../../infrastructure/repositories/UserRepository')
const LogActivity = require('./LogActivity')
const bcrypt = require('bcrypt')

class UpdateUserProfile {
  constructor() {
    this.userRepository = new UserRepository()
    this.logActivity = new LogActivity()
  }

  async execute({ id, name, password }) {
    if (!id) throw new Error('USER_ID_REQUIRED')

    let hashedPassword = null
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10)
    }

    const updatedUser = await this.userRepository.updateProfile({
      id,
      name,
      password: hashedPassword
    })

    // Log the activity
    await this.logActivity.execute({
      userId: id,
      action: 'UPDATED_PROFILE',
      details: { updatedFields: [name ? 'name' : null, password ? 'password' : null].filter(Boolean) }
    })

    return updatedUser
  }
}

module.exports = UpdateUserProfile
