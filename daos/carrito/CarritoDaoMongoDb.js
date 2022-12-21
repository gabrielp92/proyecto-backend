const ContenedorMongoDb = require('../../services/ContenedorMongoDb')
const ProductCartModel = require('../../models/productosCarrito.model')
const log4js = require('../../config/log4js')
const ProductsFactoryDAO = require('../factory')

let instance = null

class CarritoDaoMongoDb extends ContenedorMongoDb {

    constructor()
    {
        super(ProductCartModel)
        this.client = ProductsFactoryDAO.get(process.argv.dao)
        this.client.connect()
        this.timestamp = Date.now()
        this.id =  Math.floor(Math.random() * (this.timestamp - 1) + 1)
    }

    // patrón singleton
    static getInstance()
    {
        if(!instance)
        {
            instance = new CarritoDaoMongoDb();
            (async function(){
                await instance.init()
                log4js.loggerInfo.info('carrito creado')
            })();
        }
        return instance
    }

    getIdCarrito()
    {
        return this.id
    }

    getAll(id)
    {
        if(this.id == id) 
            return super.getAll()
        else
            log4js.loggerError.error('Carrito no encontrado')
    }

    async clearCart(id)
    {
        if(this.id == id)
            await super.deleteAll()
        else
            log4js.loggerError.error('Error: Carrito no encontrado')
    }

}

module.exports = CarritoDaoMongoDb