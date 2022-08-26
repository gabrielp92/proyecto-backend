const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
nombre:{type:String, require:true, max:50},
descripcion:{type:String, require:true, max:300},
código:{type:Number, require:true},
stock:{type:Number, require:true},
precio:{type:Number, require:true},
foto:{type:String, require:true, max:200},
timestamp:{type:Date, require:true, max:200}
})

const ProductModel = mongoose.model('productos', productSchema)

module.exports = ProductModel