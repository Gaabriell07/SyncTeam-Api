const express = require('express')
const cors = require('cors')
require('dotenv').config()

const userRoutes = require('./interfaces/http/routes/userRoutes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SyncTeam API running' })
})

app.use('/api/users', userRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
