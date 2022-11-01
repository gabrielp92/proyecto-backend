const log4js = require('../log4js')

class ContenedorMongoDb {

    constructor(model)
    {
        this.model = model
        this.products = []
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
                    this.products.push(document)
                    console.log('carga producto')
                    console.log(document)
                }
            })
            .catch( error => {
                log4js.loggerError.error(`${error}`)
                throw error
            })
    }

    async save(product)
    { 
        try{               
            let productModel;
            if(product.toObject().hasOwnProperty('_id'))
            {
                productModel = new this.model(product);
                productModel.isNew = true;
            }
            else
            {
                productModel = new this.model(product);
                product._id = (await this.model.findOne({"código": product.código},{"_id":1}))[0]._id;
            }
            await productModel.save()
            this.products.push(product)
        } 
        catch(error) {
            log4js.loggerError.error(`${error}`)
            throw error
        }
        return product._id
    }

    getById(id)
    {  
        const product = this.products.find(p => p._id == id)
        return product ? product : null
    }

    getAll()
    {
        return this.products
    }

    async deleteById(id)
    {
        const index = this.products.findIndex(p => p._id == id)
        if(index != -1)
        {
            this.products.splice(index,1);
            try {
                await this.model.deleteOne({"_id":id})
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
        this.products = [];
        try {
            await this.model.deleteMany({}) //elimina todos los documentos pero no la colección
        }
        catch(error) {
            log4js.loggerError.error('error al intentar eliminar colección de la BD')
            throw error
        }
    }

    async update(product, newProduct)
    {
        try {
            product.timestamp = Date.now()
            product.nombre = newProduct.nombre
            product.descripcion = newProduct.descripcion
            product.código = newProduct.código
            product.stock = newProduct.stock
            product.precio = newProduct.precio
            product.foto = newProduct.foto;
    
            await this.model.updateOne({"_id": product._id},
            { 
                $set: 
                {  
                    "timestamp": product.timestamp,
                    "nombre": product.nombre,
                    "descripcion": product.descripcion,
                    "código": product.código,
                    "stock": product.stock,
                    "precio": product.precio,
                    "foto": product.foto
                 }
            })

        }
        catch(error) {
            log4js.loggerError.error('error al intentar actualizar documento de la BD')
            throw error
        }
    }

}

module.exports = ContenedorMongoDb