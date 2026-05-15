const express = require('express')
const cors = require('cors')
require('dotenv').config()

const userRoutes = require('./interfaces/http/routes/userRoutes')
const workspaceRoutes = require('./interfaces/http/routes/workspaceRoutes')
const availabilityRoutes = require('./interfaces/http/routes/availabilityRoutes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SyncTeam API running' })
})

app.use('/api/users', userRoutes)
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/availability', availabilityRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
