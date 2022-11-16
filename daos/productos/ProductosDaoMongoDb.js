const ContenedorMongoDb = require('../../services/ContenedorMongoDb')
const ProductModel = require('../../models/producto.model')
const ProductsFactoryDAO = require('../factory')

let instance = null

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor()
    {
        super(ProductModel)
        this.client = ProductsFactoryDAO.get(process.argv.dao)
        this.client.connect()
    }

    // patrón singleton
    static getInstance()    
    {
        if(!instance)
        {
            instance = new ProductosDaoMongoDb();
            (async function(){
                await instance.init()
            })();
        }
        return instance
    }

}

module.exports = ProductosDaoMongoDb