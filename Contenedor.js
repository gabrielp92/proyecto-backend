class Contenedor {

    constructor(knex, nameTable)
    {
        this.knex = knex
        this.nameTable = nameTable
        this.products = []
        this.nextID = 1    
    }

    async init()
    {
        try {
            await this.leerTabla()
        } 
        catch (error) {
            console.log('no se pudo leer la tabla')
            console.error(error)
        }
    }

    leerTabla()
    {
        this.knex.from(this.nameTable).select('*')
        .then( rows => {
            for (const row of rows) {
                try {
                    this.products.push(JSON.parse( `{"id":${row["id"]}, "data":${row["data"]}}`))
                    this.nextID = row.id
                    
                } catch (error) {
                    console.error(error)
                }
            }
        })
        .catch( error => {
            console.log(error)
            throw error
        })
    }

    async save(product)
    {  
        this.nextID++;
        try{
            await this.knex(this.nameTable).insert({data: product})
            this.products.push(JSON.parse( `{"id":${this.nextID}, "data":${product} }` ))
        } 
        catch(error) {
            console.log(error)
            throw error
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
            this.knex.from(this.nameTable)
            .where('id', '=', index)
            .del()
            .then( () => console.log('no se pudo eliminar de la tabla'))
            .catch( error => {
                console.log(error)
                throw error
            })
            .finally(() => this.knex.destroy())
        }
        else
            console.log('error al eliminar: id no encontrado')
    }

    async deleteAll()
    {
        this.products = []
        this.knex.from(this.nameTable)
        .del()
        .then( () => console.log('contenido de la tabla eliminado'))
        .catch( error => {
            console.log(error)
            throw error
        })
        .finally(() => this.knex.destroy())
    }
}

module.exports = Contenedor