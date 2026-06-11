const RegisterUser = require('../../../application/usecases/RegisterUser')
const LoginUser = require('../../../application/usecases/LoginUser')
const GetUser = require('../../../application/usecases/GetUser')
const UpdateUserProfile = require('../../../application/usecases/UpdateUserProfile')
const GetUserActivity = require('../../../application/usecases/GetUserActivity')
const { v4: uuidv4 } = require('uuid')

const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'email, password and name are required' })
    }

    const id = uuidv4()
    const usecase = new RegisterUser()
    const user = await usecase.execute({ id, email, password, name })

    // Automatically log in the user after registration
    const loginUsecase = new LoginUser()
    const result = await loginUsecase.execute({ email, password })

    return res.status(201).json(result)
  } catch (error) {
    console.error('ERROR EN REGISTER:', error)
    if (error.message === 'EMAIL_ALREADY_EXISTS') {
      return res.status(409).json({ error: 'Email already exists' })
    }
    return res.status(500).json({ error: 'Internal server error: ' + error.message })
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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' })
    }

    const usecase = new LoginUser()
    const result = await usecase.execute({ email, password })

    return res.status(200).json(result)
  } catch (error) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { name, password } = req.body

    const usecase = new UpdateUserProfile()
    const updatedUser = await usecase.execute({ id: userId, name, password })

    return res.status(200).json(updatedUser)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error: ' + error.message })
  }
}

const getActivity = async (req, res) => {
  try {
    const userId = req.user.id
    
    const usecase = new GetUserActivity()
    const activity = await usecase.execute(userId)

    return res.status(200).json(activity)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error: ' + error.message })
  }
}

module.exports = { registerUser, loginUser, getUser, updateProfile, getActivity }
