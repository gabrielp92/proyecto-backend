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
            console.log('no se pudo leer la colección')
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
                console.log(error)
                throw error
            })
    }

    async save(product)
    { 
        try{

            product.timestamp = 0
            const productModel = new this.model(product);
            await productModel.save()
            product._id = this.model.find({código: product.código},{_id:1})
           // console.log('id: ' + product._id)
            this.products.push(product)
        } 
        catch(error) {
            console.log(error)
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
                console.log('error al intentar eliminar documento de la BD', error)
                throw error
            }
        }
        else
            console.log('error al eliminar: id no encontrado')
    }

    async deleteAll()
    {
        this.products = [];
        try {
            await this.model.deleteMany({}) //elimina todos los documentos pero no la colección
        }
        catch(error) {
            console.log('error al intentar eliminar colección de la BD', error)
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
            console.log('error al intentar actualizar documento de la BD', error)
            throw error
        }
    }

}

module.exports = ContenedorMongoDb