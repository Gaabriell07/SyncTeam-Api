require('dotenv').config()
const prisma = require('./src/infrastructure/database/prismaClient')
const CreateWorkspace = require('./src/application/usecases/CreateWorkspace')

async function test() {
  try {
    const user = await prisma.user.findFirst()
    if (!user) {
      console.log('No user found')
      return
    }

    const usecase = new CreateWorkspace()
    const workspace = await usecase.execute({ name: 'Test Workspace', userId: user.id })
    console.log('Success:', workspace)
  } catch (error) {
    console.error('Error testing createWorkspace:', error)
  } finally {
    await prisma.$disconnect()
  }
}

test()
