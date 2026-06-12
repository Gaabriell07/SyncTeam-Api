const prisma = require('./src/infrastructure/database/prismaClient');

async function fixRoles() {
  const workspaces = await prisma.workspace.findMany({
    include: { members: true }
  });

  for (const ws of workspaces) {
    if (ws.members.length > 0) {
      const hasLeader = ws.members.some(m => m.role === 'LEADER');
      if (!hasLeader) {
        // Make the first member the LEADER
        const firstMember = ws.members[0];
        await prisma.workspaceMember.update({
          where: { id: firstMember.id },
          data: { role: 'LEADER' }
        });
        console.log(`Updated workspace ${ws.name} to have LEADER ${firstMember.userId}`);
      }
    }
  }
}

fixRoles()
  .then(() => console.log('Done'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
