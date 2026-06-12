const CreateTask = require('./src/application/usecases/CreateTask');
const prisma = require('./src/infrastructure/database/prismaClient');

async function test() {
  try {
    const user = await prisma.user.findFirst();
    const ws = await prisma.workspace.findFirst();
    const usecase = new CreateTask();
    await usecase.execute({
      title: 'Test',
      description: '',
      workspaceId: ws.id,
      assigneeId: null,
      dueDate: null,
      userId: user.id
    });
    console.log('success');
  } catch(e) {
    console.error(e)
  } finally {
    await prisma.$disconnect();
  }
}
test();
