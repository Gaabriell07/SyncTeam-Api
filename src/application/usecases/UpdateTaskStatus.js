const TaskRepository = require('../../infrastructure/repositories/TaskRepository')
const WorkspaceRepository = require('../../infrastructure/repositories/WorkspaceRepository')
const NotificationRepository = require('../../infrastructure/repositories/NotificationRepository')
const UserRepository = require('../../infrastructure/repositories/UserRepository')
const { sendEmail, taskStatusChangedEmail } = require('../../infrastructure/email/emailService')

const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']

const STATUS_LABELS = {
  TODO: 'Por Hacer',
  IN_PROGRESS: 'En Progreso',
  DONE: 'Completada'
}

class UpdateTaskStatus {
  constructor(io = null) {
    this.taskRepository = new TaskRepository()
    this.workspaceRepository = new WorkspaceRepository()
    this.notificationRepo = new NotificationRepository()
    this.userRepository = new UserRepository()
    this.io = io // Socket.io instance para tiempo real
  }

  async execute({ id, status, userId }) {
    if (!VALID_STATUSES.includes(status)) {
      throw new Error('INVALID_STATUS')
    }

    const task = await this.taskRepository.findById(id)
    if (!task) throw new Error('TASK_NOT_FOUND')

    const member = await this.workspaceRepository.findMember({ workspaceId: task.workspaceId, userId })
    if (!member) throw new Error('FORBIDDEN')

    // Obtener info del usuario que hace el cambio
    const changedByUser = await this.userRepository.findById(userId)

    // Actualizar estado
    const updatedTask = await this.taskRepository.updateStatus({ id, status })

    // ── Notificaciones ──────────────────────────────────────────────────────
    try {
      const workspace = await this.workspaceRepository.findById(task.workspaceId)
      const statusLabel = STATUS_LABELS[status] || status
      const changedByName = changedByUser?.name || 'Un miembro'
      const workspaceName = workspace?.name || 'el espacio de trabajo'

      // Obtener todos los miembros activos del workspace para notificarles
      const members = await this.workspaceRepository.findMembers(task.workspaceId)

      for (const wsMember of members) {
        // No notificar a quien hizo el cambio
        if (wsMember.userId === userId) continue

        const notification = await this.notificationRepo.create({
          userId: wsMember.userId,
          title: 'Estado de tarea actualizado',
          message: `${changedByName} cambió "${task.title}" a ${statusLabel}`,
          type: 'TASK_STATUS_CHANGE',
          metadata: {
            taskId: task.id,
            workspaceId: task.workspaceId,
            changedBy: userId,
            changedByName,
            newStatus: status
          }
        })

        // Emitir en tiempo real
        if (this.io) {
          this.io.to(`user:${wsMember.userId}`).emit('notification:new', notification)
        }

        // Email al asignado (si la tarea tiene asignado y no es quien hizo el cambio)
        if (task.assigneeId && task.assigneeId === wsMember.userId) {
          const assignee = await this.userRepository.findById(task.assigneeId)
          if (assignee) {
            const { subject, html } = taskStatusChangedEmail({
              recipientName: assignee.name,
              taskTitle: task.title,
              newStatus: status,
              changedByName,
              workspaceName
            })
            await sendEmail(assignee.email, subject, html)
          }
        }
      }
    } catch (notifErr) {
      // Las notificaciones no deben bloquear la operación principal
      console.error('[UpdateTaskStatus] Error al crear notificaciones:', notifErr.message)
    }

    return updatedTask
  }
}

module.exports = UpdateTaskStatus
