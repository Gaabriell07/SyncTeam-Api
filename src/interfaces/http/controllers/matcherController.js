const RunMatcher = require('../../../application/usecases/RunMatcher')

const runMatcher = async (req, res) => {
  try {
    const { workspaceId } = req.params
    const { minScore } = req.query

    const usecase = new RunMatcher()
    const result = await usecase.execute({
      workspaceId,
      minScore: minScore ? parseFloat(minScore) : 0.5
    })

    return res.status(200).json(result)
  } catch (error) {
    if (error.message === 'NO_AVAILABILITY_DATA') {
      return res.status(404).json({ error: 'No availability data found for this workspace' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { runMatcher }
