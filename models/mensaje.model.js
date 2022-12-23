/*
mensajes: chat del usuario (preguntas y respuestas)
    Email: del usuario que pregunta o al que se responde
    Tipo (‘usuario’ para preguntas ó ‘sistema’ para respuestas)
    Fecha y hora
    Cuerpo del mensaje
*/

const mongoose = require('mongoose')

const mensajeSchema = new mongoose.Schema({
email:{type:String, require:true, max:200},
tipo:{type:String, require:true, max:30},
fecha:{type:String, require:true},
hora:{type:String, require:true},
mensaje:{type:String, require:true}
})

const mensajeModel = mongoose.model('mensajes', mensajeSchema)

module.exports = mensajeModel