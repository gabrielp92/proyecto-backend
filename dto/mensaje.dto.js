class MensajeDTO{
    constructor(data){
        this.email = data.email
        this.tipo = data.tipo
        this.fecha = data.fecha
        this.hora = data.hora
        this.mensaje = data.mensaje
        this._id = data._id
    }
}

module.exports = MensajeDTO