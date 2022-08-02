const Contenedor = require('../Contenedor');
let contenedor = new Contenedor('productos.json');
(async function(){
    await contenedor.init()
})();

/*********************************************************/
const express = require('express')
const { Router } = express
const routerProducts = Router()

routerProducts.get('/:id?', (request, response) =>  {
    let productos = null
    if(request.params.id == undefined)
        productos = contenedor.getAll()
    else
    {
        productos = contenedor.getById(request.params.id)
        if(productos == null)
        {
            response.status(404)
            response.json({error : 'producto no encontrado'})
            return
        }
    }
    response.json(productos)
})

routerProducts.post('/', (request,response) => {
   
    console.log('POST recibido');
    (async function(){
        await contenedor.save(request.body)
    })();
    response.json(contenedor.getAll()[contenedor.getAll().length-1])
})

routerProducts.put('/:id', (request,response) => {

    console.log('PUT recibido')

    const producto = contenedor.getById(request.params.id)
    if(producto == null)
    {
        response.status(404)
        response.json({error : 'producto no encontrado'})
        return
    }

    producto.timestamp = Date.now()
    producto.nombre = request.body.nombre
    producto.descripcion = request.body.descripcion
    producto.código = request.body.código
    producto.stock = request.body.stock
    producto.precio = request.body.precio
    producto.foto = request.body.foto;
    (async function(){
        await contenedor.saveFile()
    })();

    response.json("actualiza producto con id:" + request.params.id)
})

routerProducts.delete('/:id', (request,response) => {
    console.log('DELETE recibido');
    (async function(){
        await contenedor.deleteById(request.params.id)
    })();
    response.json()
})

module.exports = {
    contenedor : contenedor,
    routerProducts : routerProducts
}