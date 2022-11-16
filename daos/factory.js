const MongoClient = require('./mongoClient')
const FileClient = require('./fileClient')

class ProductsFactoryDAO {
    static get(type) {
        switch (type) {
            case 'file': return new FileClient('productos.json')
            case 'mongo': return new MongoClient()
            default: return new MongoClient()
        }
    }
}

module.exports = ProductsFactoryDAO