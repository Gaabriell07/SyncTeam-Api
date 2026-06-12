const cron = require('node-cron')
const prisma = require('../database/prismaClient')
const NotificationRepository = require('../repositories/NotificationRepository')
const { sendEmail, taskDueSoonEmail } = require('../email/emailService')

/**
 * Job que corre cada hora.
 * - Detecta tareas que vencen en las próximas 24 horas (y no están DONE).
 * - Crea una notificación in-app para el asignado.
 * - Envía un email de recordatorio al asignado.
 * 
 * Para evitar notificaciones duplicadas, solo notifica tareas cuya
 * dueDate esté entre AHORA y AHORA + 24h, y solo una vez (revisa si
 * ya existe una notificación TASK_DUE_SOON reciente para esa tarea).
 */
const startDueDateReminderJob = (io) => {
  const notificationRepo = new NotificationRepository()

  cron.schedule('0 * * * *', async () => {
    console.log('[DueDateJob] Revisando tareas próximas a vencer...')
    try {
      const now = new Date()
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      // Tareas que vencen en las próximas 24h y no están completadas
      const tasks = await prisma.task.findMany({
        where: {
          dueDate: { gte: now, lte: in24h },
          status: { not: 'DONE' },
          assigneeId: { not: null }
        },
        include: {
          assignee: true,
          workspace: true
        }
      })

      for (const task of tasks) {
        // Evitar duplicados: buscar si ya hay notificación de vencimiento para esta tarea en las últimas 25h
        const recent = await prisma.notification.findFirst({
          where: {
            userId: task.assigneeId,
            type: 'TASK_DUE_SOON',
            metadata: { path: ['taskId'], equals: task.id },
            createdAt: { gte: new Date(now.getTime() - 25 * 60 * 60 * 1000) }
          }
        })
        if (recent) continue

        // Crear notificación in-app
        const notification = await notificationRepo.create({
          userId: task.assigneeId,
          title: '⏰ Tarea próxima a vencer',
          message: `La tarea "${task.title}" vence en menos de 24 horas.`,
          type: 'TASK_DUE_SOON',
          metadata: { taskId: task.id, workspaceId: task.workspaceId }
        })

        // Emitir por Socket.io en tiempo real
        if (io) {
          io.to(`user:${task.assigneeId}`).emit('notification:new', notification)
        }

        // Enviar email al asignado
        const { subject, html } = taskDueSoonEmail({
          recipientName: task.assignee.name,
          taskTitle: task.title,
          dueDate: task.dueDate,
          workspaceName: task.workspace.name
        })
        await sendEmail(task.assignee.email, subject, html)

        console.log(`[DueDateJob] Recordatorio enviado para tarea "${task.title}" a ${task.assignee.email}`)
      }
    } catch (err) {
      console.error('[DueDateJob] Error:', err.message)
    }
  })

  console.log('[DueDateJob] Cron de recordatorios iniciado (cada hora)')
}

module.exports = { startDueDateReminderJob }
