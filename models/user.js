const mongoose = require('mongoose')

const UserModel = mongoose.model('users', { email: String, password: String })

module.exports = UserModel