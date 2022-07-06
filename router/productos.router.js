const Contenedor = require('../js/Contenedor');
const contenedor = new Contenedor('productos.txt');
(async function(){
    await contenedor.init()
})();

/*********************************************************/

const express = require('express')
const { Router } = express
const routerProducts = Router()

routerProducts.get('/', (request, response) =>  {
    response.json(contenedor.getAll())
})

routerProducts.get('/:id', (request, response) =>  {
    const producto = contenedor.getById(request.params.id)
    if(producto == null)
    {
        response.status(404)
        response.json({error : 'producto no encontrado'})
        return
    }
    response.json(producto)   
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

    producto.title = request.body.title
    producto.price = request.body.price
    producto.thumbnail = request.body.thumbnail;
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

module.exports = routerProducts