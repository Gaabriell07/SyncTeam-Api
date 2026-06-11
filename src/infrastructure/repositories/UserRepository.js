const prisma = require('../database/prismaClient')
const User = require('../../domain/entities/User')

class UserRepository {
  async findByEmail(email) {
    const user = await prisma.user.findUnique({ where: { email } })
    return user ? new User(user) : null
  }

  async findById(id) {
    const user = await prisma.user.findUnique({ 
      where: { id },
      include: {
        memberships: {
          include: {
            workspace: {
              include: {
                members: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        }
      }
    })
    if (!user) return null
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async create({ email, password, name, id }) {
    const user = await prisma.user.create({
      data: { id, email, password, name }
    })
    return new User(user)
  }

  async updateProfile({ id, name, password }) {
    const data = {}
    if (name) data.name = name
    if (password) data.password = password

    const user = await prisma.user.update({
      where: { id },
      data
    })
    
    // Do not return password hash
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}

module.exports = UserRepository
