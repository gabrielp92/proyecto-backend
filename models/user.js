const mongoose = require('mongoose')

const UserModel = mongoose.model('users', { username: String, password: String, name:String })

module.exports = UserModel