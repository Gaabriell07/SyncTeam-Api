const CreateWorkspace = require('../../../application/usecases/CreateWorkspace')
const JoinWorkspace = require('../../../application/usecases/JoinWorkspace')
const GetWorkspace = require('../../../application/usecases/GetWorkspace')
const ToggleMemberStatus = require('../../../application/usecases/ToggleMemberStatus')

const createWorkspace = async (req, res) => {
  try {
    const { name, userId } = req.body
    if (!name || !userId) {
      return res.status(400).json({ error: 'name and userId are required' })
    }

    const usecase = new CreateWorkspace()
    const workspace = await usecase.execute({ name, userId })
    return res.status(201).json(workspace)
  } catch (error) {
    console.error('Error creating workspace:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

const joinWorkspace = async (req, res) => {
  try {
    const { inviteCode, userId, role } = req.body
    if (!inviteCode || !userId) {
      return res.status(400).json({ error: 'inviteCode and userId are required' })
    }

    const usecase = new JoinWorkspace()
    const workspace = await usecase.execute({ inviteCode, userId, role })
    return res.status(200).json(workspace)
  } catch (error) {
    if (error.message === 'WORKSPACE_NOT_FOUND') {
      return res.status(404).json({ error: 'Workspace not found' })
    }
    if (error.message === 'ALREADY_A_MEMBER') {
      return res.status(409).json({ error: 'User is already a member' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const getWorkspace = async (req, res) => {
  try {
    const { id } = req.params
    const usecase = new GetWorkspace()
    const workspace = await usecase.execute(id)
    return res.status(200).json(workspace)
  } catch (error) {
    if (error.message === 'WORKSPACE_NOT_FOUND') {
      return res.status(404).json({ error: 'Workspace not found' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const toggleMemberStatus = async (req, res) => {
  try {
    const { id, userId } = req.params
    const { isActive } = req.body

    const usecase = new ToggleMemberStatus()
    const member = await usecase.execute({ workspaceId: id, userId, isActive })
    return res.status(200).json(member)
  } catch (error) {
    if (error.message === 'MEMBER_NOT_FOUND') {
      return res.status(404).json({ error: 'Member not found' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

const UpdateMemberRole = require('../../../application/usecases/UpdateMemberRole')

const updateMemberRole = async (req, res) => {
  try {
    const { id, userId } = req.params
    const { role } = req.body

    const usecase = new UpdateMemberRole()
    const member = await usecase.execute({ workspaceId: id, userId, role })
    return res.status(200).json(member)
  } catch (error) {
    if (error.message === 'MEMBER_NOT_FOUND') {
      return res.status(404).json({ error: 'Member not found' })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { createWorkspace, joinWorkspace, getWorkspace, toggleMemberStatus, updateMemberRole }
