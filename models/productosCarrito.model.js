const mongoose = require('mongoose')

const productCartSchema = new mongoose.Schema({
nombre:{type:String, require:true, max:50},
descripcion:{type:String, require:true, max:300},
codigo:{type:Number, require:true},
stock:{type:Number, require:true},
precio:{type:Number, require:true},
foto:{type:String, require:true, max:200},
timestamp:{type:Date, default: Date.now()}
})

const ProductCartModel = mongoose.model('carritoproductos', productCartSchema)

module.exports = ProductCartModel