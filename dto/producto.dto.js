class ProductoDTO{
    constructor(data){
        this.nombre = data.nombre
        this.descripcion = data.descripcion
        this.codigo = data.codigo
        this.stock = data.stock
        this.precio = data.precio
        this.foto = data.foto
        this.timestamp = data.timestamp
        this._id = data._id
    }
}

module.exports = ProductoDTO