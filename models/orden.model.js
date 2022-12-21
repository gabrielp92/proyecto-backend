const mongoose = require('mongoose')

const ordenSchema = new mongoose.Schema({
items:{type:String, require:true},
numero:{type:Number, require:true},
timestamp:{type:Date, default: Date.now()},
estado:{type:String, default:"generada"},
email:{type:String, require:true}
})

const OrdenModel = mongoose.model('ordenes', ordenSchema)

module.exports = OrdenModel
