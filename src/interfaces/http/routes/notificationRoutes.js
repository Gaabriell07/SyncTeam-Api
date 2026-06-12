const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const { getNotifications, markAllRead, clearAll } = require('../controllers/notificationController')

// GET    /api/notifications         → obtener mis notificaciones
router.get('/', authMiddleware, getNotifications)

// PATCH  /api/notifications/read    → marcar todas como leídas
router.patch('/read', authMiddleware, markAllRead)

// DELETE /api/notifications         → limpiar todas
router.delete('/', authMiddleware, clearAll)

module.exports = router
