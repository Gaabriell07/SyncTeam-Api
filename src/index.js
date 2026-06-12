const express = require('express')
const cors = require('cors')
require('dotenv').config()

const userRoutes = require('./interfaces/http/routes/userRoutes')
const workspaceRoutes = require('./interfaces/http/routes/workspaceRoutes')
const availabilityRoutes = require('./interfaces/http/routes/availabilityRoutes')
const matcherRoutes = require('./interfaces/http/routes/matcherRoutes')
const taskRoutes = require('./interfaces/http/routes/taskRoutes')
const notificationRoutes = require('./interfaces/http/routes/notificationRoutes')
const { startDueDateReminderJob } = require('./infrastructure/jobs/dueDateReminderJob')

const app = express()
const PORT = process.env.PORT || 3000

const http = require('http')
const { Server } = require('socket.io')

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

app.set('io', io)

io.on('connection', (socket) => {
  // Unirse a la sala del workspace (para actualizaciones de tareas)
  socket.on('joinWorkspace', (workspaceId) => {
    if (workspaceId) {
      socket.join(workspaceId)
      console.log(`Socket ${socket.id} joined workspace ${workspaceId}`)
    }
  })

  // Unirse a la sala personal del usuario (para notificaciones)
  socket.on('joinUserRoom', (userId) => {
    if (userId) {
      socket.join(`user:${userId}`)
      console.log(`Socket ${socket.id} joined user room user:${userId}`)
    }
  })
})

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SyncTeam API running' })
})

app.use('/api/users', userRoutes)
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/availability', availabilityRoutes)
app.use('/api/matcher', matcherRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/notifications', notificationRoutes)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  // Iniciar cron de recordatorios de vencimiento
  startDueDateReminderJob(io)
})

module.exports = app
