const ContenedorMongoDb = require('../../contenedores/ContenedorMongoDb')
const ProductCartModel = require('../../models/productosCarrito')

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
            console.log('Carrito no encontrado')
    }

    async clearCart(id)
    {
        if(this.id == id)
            await super.deleteAll()
        else
            console.log('Error: Carrito no encontrado')
    }

    async desconectar()
    {}
}

module.exports = CarritoDaoMongoDb