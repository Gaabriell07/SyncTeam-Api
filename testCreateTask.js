const { v4: uuidv4 } = require('uuid')
require('dotenv').config(); const CreateTask = require('./src/application/usecases/CreateTask')

async function run() {
  try {
    const usecase = new CreateTask()
    const task = await usecase.execute({
      title: 'Test Task',
      description: '',
      workspaceId: 'test',
      assigneeId: null,
      dueDate: null,
      userId: 'test'
    })
    console.log(task)
  } catch (error) {
    console.error(error)
  }
}

run()
