const prisma = require('../database/prismaClient')
const User = require('../../domain/entities/User')

class UserRepository {
  async findByEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } })
    return user ? new User(user) : null
  }

  async findById(id) {
    const user = await prisma.user.findUnique({ where: { id } })
    return user ? new User(user) : null
  }

  async create({ email, name, id }) {
    const user = await prisma.user.create({
      data: { id, email, name }
    })
    return new User(user)
  }
}

module.exports = UserRepository
