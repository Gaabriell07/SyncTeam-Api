class User {
  constructor({ id, email, name, createdAt }) {
    this.id = id
    this.email = email
    this.name = name
    this.createdAt = createdAt
  }
}

module.exports = User
