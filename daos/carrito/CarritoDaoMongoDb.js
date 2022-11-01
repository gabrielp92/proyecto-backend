const ContenedorMongoDb = require('../../contenedores/ContenedorMongoDb')
const ProductCartModel = require('../../models/productosCarrito')
const log4js = require('../../log4js')

class CarritoDaoMongoDb extends ContenedorMongoDb {

    constructor()
    {
        super(ProductCartModel)
        this.timestamp = Date.now()
        this.id =  Math.floor(Math.random() * (this.timestamp - 1) + 1)
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

    async desconectar()
    {}
}

module.exports = CarritoDaoMongoDb