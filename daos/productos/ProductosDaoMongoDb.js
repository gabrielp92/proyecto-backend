const ContenedorMongoDb = require('../../services/ContenedorMongoDb')
const ProductModel = require('../../models/producto')

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor()
    {
        super(ProductModel)
    }

    async desconectar()
    {}
}

module.exports = ProductosDaoMongoDb