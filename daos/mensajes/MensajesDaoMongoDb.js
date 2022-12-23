const ContenedorMongoDb = require('../../services/ContenedorMensajesMongoDb')
const mensajeModel = require('../../models/mensaje.model')
const ProductsFactoryDAO = require('../factory')

let instance = null

class MensajesDaoMongoDb extends ContenedorMongoDb {

    constructor()
    {
        super(mensajeModel)
        this.client = ProductsFactoryDAO.get(process.argv.dao)
        this.client.connect()
    }

    // patrón singleton
    static getInstance()    
    {
        if(!instance)
        {
            instance = new MensajesDaoMongoDb();
            (async function(){
                await instance.init()
            })();
        }
        return instance
    }

}

module.exports = MensajesDaoMongoDb