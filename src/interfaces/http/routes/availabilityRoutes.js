const express = require('express')
const { saveAvailability, getWorkspaceAvailability } = require('../controllers/availabilityController')

const router = express.Router()

router.post('/', saveAvailability)
router.get('/:workspaceId', getWorkspaceAvailability)

module.exports = router
