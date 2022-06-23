const fs = require('fs')

class Contenedor {

    constructor(filename)
    {
        this.filename = filename
        this.products = []
        this.nextID = 1
    }

    async init()
    {
        try {
            const data = await this.readFile()
            if(data.length > 0) {
                this.products = data
                this.nextID = this.products[data.length-1].id + 1
            }
        } catch (error) {
            console.log('no se pudo leer el archivo')
            console.error(error)
        }
    }

    async save(product)
    {
        product.id = this.nextID
        this.products.push(product)
        this.nextID++
        try{
            await this.saveFile()
        } catch(error) {
            console.log(error)
        }
        return product.id
    }

    getById(id)
    {
        const product = this.products.find(p => p.id == id)
        return product ? product : null
    }

    getAll()
    {
        return this.products
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
        return fs.promises.readFile(this.filename,'utf-8')
            .then(data => JSON.parse(data))
            .catch(() => '')
    }

    saveFile()
    {
        return fs.promises.writeFile(this.filename, JSON.stringify(this.products))
    }
}

module.exports = Contenedor
