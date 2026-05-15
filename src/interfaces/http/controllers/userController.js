const RegisterUser = require('../../../application/usecases/RegisterUser')
const GetUser = require('../../../application/usecases/GetUser')

const registerUser = async (req, res) => {
  try {
    const { id, email, name } = req.body

    if (!id || !email || !name) {
      return res.status(400).json({ error: 'id, email and name are required' })
    }

    const usecase = new RegisterUser()
    const user = await usecase.execute({ id, email, name })

    return res.status(201).json(user)
  } catch (error) {
    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      return res.status(409).json({ error: 'Email already exists' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const getUser = async (req, res) => {
  try {
    const { id } = req.params

    const usecase = new GetUser()
    const user = await usecase.execute(id)

    return res.status(200).json(user)
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'User not found' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { registerUser, getUser }
