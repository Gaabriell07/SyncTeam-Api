const GetNotifications = require('../../../application/usecases/GetNotifications')
const ClearNotifications = require('../../../application/usecases/ClearNotifications')

const getNotifications = async (req, res) => {
  try {
    const usecase = new GetNotifications()
    const data = await usecase.execute(req.user.id)
    return res.status(200).json(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Error al obtener notificaciones' })
  }
}

const markAllRead = async (req, res) => {
  try {
    const usecase = new ClearNotifications()
    await usecase.markAllRead(req.user.id)
    return res.status(200).json({ message: 'Notificaciones marcadas como leídas' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Error al marcar notificaciones' })
  }
}

const clearAll = async (req, res) => {
  try {
    const usecase = new ClearNotifications()
    await usecase.clearAll(req.user.id)
    return res.status(200).json({ message: 'Notificaciones eliminadas' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Error al limpiar notificaciones' })
  }
}

module.exports = { getNotifications, markAllRead, clearAll }
