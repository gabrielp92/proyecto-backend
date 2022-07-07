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
                this.products.map( (p,index) => (!p.hasOwnProperty('id')) ? p.id = index + 1 : p.id)
                this.nextID = this.products[data.length-1].id + 1    
                await this.saveFile()
            }
        } catch (error) {
            console.log('no se pudo leer el archivo')
            console.error(error)
        }
    }

    async save(product)
    {
        if(this.products.length > 0) {

            console.log(this.products.length)

            this.nextID = this.products[this.products.length-1].id + 1
        }
        
        product.id = this.nextID
        this.products.push(product)
       // this.nextID++
        try{
            await this.appendFile()
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
        return fs.promises.readFile(`./uploads/${this.filename}`,'utf-8')
            .then(data => JSON.parse(data))
            .catch(() => '')
    }

    appendFile()
    {
        return fs.promises.appendFile(`./uploads/${this.filename}`, JSON.stringify(this.products))
       //return fs.promises.writeFile(`./uploads/${this.filename}`, JSON.stringify(this.products), {flag: 'a+'})
    }

    saveFile()
    {
       // return fs.promises.appendFile(`./uploads/${this.filename}`, JSON.stringify(this.products))
        return fs.promises.writeFile(`./uploads/${this.filename}`, JSON.stringify(this.products))
    }

}

module.exports = Contenedor
