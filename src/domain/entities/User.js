class User {
  constructor({ id, email, password, name, createdAt }) {
    this.id = id
    this.email = email
    this.password = password
    this.name = name
    this.createdAt = createdAt
  }
}

module.exports = User
