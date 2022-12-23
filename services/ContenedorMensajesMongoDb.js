const log4js = require('../config/log4js')
const MensajeDTO = require('../dto/mensaje.dto')

class ContenedorMensajesMongoDb {

    constructor(model)
    {
        this.model = model
        this.mensajes = []
    }

    async init()
    {
        try {  
            await this.readColeccion()
        } 
        catch (error) {
            log4js.loggerError.error('no se pudo leer la colección')
            console.error(error)
        }
    }

    readColeccion()
    {
        this.model.find({})
            .then( documents => {
                for(const document of documents) {
                    this.mensajes.push(document)
                    log4js.loggerInfo.info('carga mensaje')
                    console.log(document)
                }
            })
            .catch( error => {
                log4js.loggerError.error(`${error}`)
                throw error
            })
    }

    async save(mensaje)
    { 
        try{               
            let mensajeModel;
            mensajeModel = new this.model(mensaje);
            mensajeModel.isNew = true;
            await mensajeModel.save()
            this.mensajes.push(mensaje)
        } 
        catch(error) {
            log4js.loggerError.error(`${error}`)
            throw error
        }
        //return product._id
        return new MensajeDTO(mensaje)._id
    }

    getById(id)
    {  
        const mensaje = this.mensajes.find(m => m._id == id)
        //return product ? new product : null
        return mensaje ? new MensajeDTO(mensaje) : null
    }

    getAll()
    {
        //return this.products
        const mensajesResult = this.mensajes.map(m => {return new MensajeDTO(m)})
        return mensajesResult
    }

    async deleteById(id)
    {
        const index = this.mensajes.findIndex(m => m._id == id)
        if(index != -1)
        {
            this.mensajes.splice(index,1);
            try {
                //await this.model.deleteOne({"_id":id})
                const mensajeDeleted = await this.model.deleteOne({"_id":id})
                return new MensajeDTO(mensajeDeleted)
            }
            catch(error) {
                log4js.loggerError.error('error al intentar eliminar documento de la BD')
                throw error
            }
        }
        else
            log4js.loggerError.error('error al eliminar: id no encontrado')
    }

    async deleteAll()
    {
        this.mensajes = [];
        try {
            await this.model.deleteMany({}) //elimina todos los documentos pero no la colección
        }
        catch(error) {
            log4js.loggerError.error('error al intentar eliminar colección de la BD')
            throw error
        }
    }

}

module.exports = ContenedorMensajesMongoDb