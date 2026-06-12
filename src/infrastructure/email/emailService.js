const nodemailer = require('nodemailer')

// Transporter reutilizable — se conecta con las credenciales del .env
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD // App Password de Google (16 caracteres)
    }
  })
}

/**
 * Envía un email de notificación.
 * @param {string} to - Correo destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} html - Contenido HTML del correo
 */
const sendEmail = async (to, subject, html) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('[EmailService] Credenciales de Gmail no configuradas. Email no enviado.')
    return
  }
  try {
    const transporter = createTransporter()
    await transporter.sendMail({
      from: `"SyncTeam" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    })
    console.log(`[EmailService] Email enviado a ${to}: ${subject}`)
  } catch (err) {
    console.error('[EmailService] Error al enviar email:', err.message)
  }
}

// ─── Templates ───────────────────────────────────────────────────────────────

const taskStatusChangedEmail = ({ recipientName, taskTitle, newStatus, changedByName, workspaceName }) => {
  const statusLabels = { TODO: 'Por Hacer', IN_PROGRESS: 'En Progreso', DONE: 'Completada' }
  const statusColors = { TODO: '#64748b', IN_PROGRESS: '#3b82f6', DONE: '#22c55e' }
  const label = statusLabels[newStatus] || newStatus
  const color = statusColors[newStatus] || '#64748b'

  return {
    subject: `[SyncTeam] "${taskTitle}" cambió a ${label}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 12px;">
        <div style="background: #0f172a; padding: 20px 28px; border-radius: 8px 8px 0 0; margin-bottom: 0;">
          <h2 style="color: white; margin: 0; font-size: 18px;">🔔 SyncTeam</h2>
        </div>
        <div style="background: white; padding: 28px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
          <p style="color: #334155; margin-top: 0;">Hola <strong>${recipientName}</strong>,</p>
          <p style="color: #334155;">
            <strong>${changedByName}</strong> actualizó el estado de una tarea en 
            <strong>${workspaceName}</strong>:
          </p>
          <div style="background: #f1f5f9; border-left: 4px solid ${color}; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; font-weight: 600; color: #0f172a;">${taskTitle}</p>
            <p style="margin: 8px 0 0; color: #64748b; font-size: 14px;">
              Nuevo estado: <span style="color: ${color}; font-weight: 600;">${label}</span>
            </p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
            Este es un mensaje automático de SyncTeam · 2026
          </p>
        </div>
      </div>
    `
  }
}

const taskDueSoonEmail = ({ recipientName, taskTitle, dueDate, workspaceName }) => {
  const formatted = new Date(dueDate).toLocaleString('es-ES', {
    dateStyle: 'full', timeStyle: 'short'
  })
  return {
    subject: `[SyncTeam] ⚠️ Tarea próxima a vencer: "${taskTitle}"`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 12px;">
        <div style="background: #0f172a; padding: 20px 28px; border-radius: 8px 8px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 18px;">⏰ SyncTeam — Recordatorio</h2>
        </div>
        <div style="background: white; padding: 28px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
          <p style="color: #334155; margin-top: 0;">Hola <strong>${recipientName}</strong>,</p>
          <p style="color: #334155;">
            Tienes una tarea en <strong>${workspaceName}</strong> que vence pronto:
          </p>
          <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; font-weight: 600; color: #0f172a;">${taskTitle}</p>
            <p style="margin: 8px 0 0; color: #9a3412; font-size: 14px;">Vence: ${formatted}</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
            Este es un mensaje automático de SyncTeam · 2026
          </p>
        </div>
      </div>
    `
  }
}

module.exports = { sendEmail, taskStatusChangedEmail, taskDueSoonEmail }
