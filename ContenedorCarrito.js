const fs = require('fs')

class ContenedorCarrito {

    constructor(filename)
    {
        this.filename = filename
        this.products = []
        this.timestamp = Date.now()
        this.id =  Math.floor(Math.random() * (this.timestamp - 1) + 1)
      //  this.nextID = 1
    }

    async init()
    {
        try {
            const data = await this.readFile()
            if(data.length > 0) {
                this.products = data
               // this.products.map( (p,index) => (!p.hasOwnProperty('id')) ? p.id = index + 1 : p.id)
              //  this.nextID = this.products[data.length-1].id + 1    
                await this.saveFile()
            }
        } catch (error) {
            console.log('no se pudo leer el archivo')
            console.error(error)
        }
    }

    async save(product)
    {
       /* if(this.products.length > 0) {
            this.nextID = this.products[this.products.length-1].id + 1
        }   
        product.id = this.nextID*/
        product.timestamp = Date.now()
        this.products.push(product)
        try{
            await this.saveFile()
        } catch(error) {
            console.log(error)
        }
        return product.id
    }

    getIdCarrito()
    {
        return this.id
    }

    getById(id)
    {
        const product = this.products.find(p => p.id == id)
        return product ? product : null
    }

    getAll(id)
    {
        if(this.id == id) 
            return this.products
        else
            console.log('Carrito no encontrado')
    }

    async clearCart(id)
    {
        if(this.id == id)
            await this.deleteAll()
        else
            console.log('Error: Carrito no encontrado')
    }

    async deleteById(id)
    {
        const index = this.products.findIndex(p => p.id == id)
        if(index != -1)
        {
            this.products.splice(index,1)
            try {
                await this.saveFile()
            } catch(error) {
                console.log(error)
            }
        }
        else
            console.log('error al eliminar: id no encontrado')
    }

    async deleteAll()
    {
        this.products = []
        try {
            await this.saveFile()
        } catch(error) {
            console.log(error)
        }
    }

    readFile()
    {
        return fs.promises.readFile(`./uploads/${this.filename}`,'utf-8')
            .then(data => JSON.parse(data))
            .catch(() => '')
    }

    saveFile()
    {
        const dataToSave = { id:this.id, timestamp:this.timestamp, productos: this.products }
        return fs.promises.writeFile(`./uploads/${this.filename}`, JSON.stringify(dataToSave,null,2))
    }
}

module.exports = ContenedorCarrito