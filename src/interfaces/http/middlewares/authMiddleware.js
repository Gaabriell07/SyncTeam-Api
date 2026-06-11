const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret'
    const decoded = jwt.verify(token, secret)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }
}

module.exports = authMiddleware
