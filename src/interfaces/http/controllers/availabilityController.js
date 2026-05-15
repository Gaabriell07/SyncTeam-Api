const SaveAvailability = require('../../../application/usecases/SaveAvailability')
const GetWorkspaceAvailability = require('../../../application/usecases/GetWorkspaceAvailability')

const saveAvailability = async (req, res) => {
  try {
    const { userId, workspaceId, slots } = req.body

    if (!userId || !workspaceId || !slots) {
      return res.status(400).json({ error: 'userId, workspaceId and slots are required' })
    }

    const usecase = new SaveAvailability()
    const availability = await usecase.execute({ userId, workspaceId, slots })
    return res.status(200).json(availability)
  } catch (error) {
    if (error.message === 'INVALID_SLOTS') {
      return res.status(400).json({ error: 'slots must be a non-empty array' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const getWorkspaceAvailability = async (req, res) => {
  try {
    const { workspaceId } = req.params

    const usecase = new GetWorkspaceAvailability()
    const availabilities = await usecase.execute(workspaceId)
    return res.status(200).json(availabilities)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { saveAvailability, getWorkspaceAvailability }
