const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.init();
  }

  async init() {
    try {
      // Use Ethereal for testing
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
      console.log('Ethereal Email initialized: %s', testAccount.user);
    } catch (error) {
      console.error('Error initializing EmailService:', error);
    }
  }

  async sendTaskAssignedEmail(userEmail, taskTitle, workspaceName, dueDate) {
    if (!this.transporter) {
      console.warn('Email transporter not ready yet');
      return;
    }

    try {
      const dueDateStr = dueDate ? new Date(dueDate).toLocaleDateString() : 'Sin fecha límite';
      const info = await this.transporter.sendMail({
        from: '"SyncTeam" <noreply@syncteam.ac>',
        to: userEmail,
        subject: `Nueva Tarea Asignada: ${taskTitle}`,
        text: `Se te ha asignado una nueva tarea en el equipo ${workspaceName}: "${taskTitle}". Fecha límite: ${dueDateStr}. Revisa tu tablero en SyncTeam.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0F172A;">Nueva Tarea Asignada</h2>
            <p>Se te ha asignado una nueva tarea en el equipo <strong>${workspaceName}</strong>.</p>
            <div style="background-color: #F8FAFC; padding: 15px; border-left: 4px solid #2563EB; margin: 20px 0;">
              <strong>Tarea:</strong> ${taskTitle}<br/>
              <strong>Fecha límite:</strong> ${dueDateStr}
            </div>
            <p>Revisa tu tablero en SyncTeam para más detalles.</p>
          </div>
        `
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

module.exports = new EmailService();
