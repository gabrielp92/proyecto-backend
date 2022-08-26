const rout  = require('./productos.router');
const CarritoDaoMongoDb = require('../daos/carrito/CarritoDaoMongoDb');
const express = require('express');
const { Router } = express
const routerCarrito = Router()
let contenedorCarrito = null

routerCarrito.post('/', (req,res) => {
    contenedorCarrito = new CarritoDaoMongoDb();
    (async function(){
        await contenedorCarrito.init()
    })();
    res.json(contenedorCarrito.getIdCarrito())
})

routerCarrito.delete('/:id', (req,res) => {
  
    if(contenedorCarrito != null)
    {
        contenedorCarrito.clearCart(req.params.id)
            .then(() => res.redirect(`${req.baseUrl}/cargarCarrito`))
            .catch(() => console.log('Error al eliminar carrito'))
    }
    else
    {
        console.log('carrito no creado')
        res.json()
    }
})

routerCarrito.get('/cargarCarrito', (req,res) => {
    if(contenedorCarrito != null)
    {
        res.json(contenedorCarrito.getAll(contenedorCarrito.getIdCarrito()))
    }
    else
    {
        console.log('carrito no creado')
        res.json()
    }
})

routerCarrito.get('/:id/productos', (req,res) => {
    if(contenedorCarrito != null)
        res.json(contenedorCarrito.getAll(req.params.id))
    else
    {
        console.log('carrito no creado')
        res.json()
    }
})

routerCarrito.post('/cargarCarritoPorId', (req,res) => {
    if(contenedorCarrito != null)
    {
        const producto = rout.contenedor.getById(req.body.productoId)
        if(producto != null)
        {
            contenedorCarrito.save(producto)
            .then(() => res.redirect('/'))
            .catch(() => console.log('Error al guardar producto en carrito'))
        }
        else
            console.log('producto no encontrado')
    }
    else
    {
        console.log('carrito no creado')
        res.json()
    }
})

routerCarrito.post('/:id/productos', (req,res) => {
    if(contenedorCarrito != null)
    {
        const producto = rout.contenedor.getById(req.params.id)
        if(producto != null)
        {
            contenedorCarrito.save(producto)
                .then(() => res.redirect(`${req.baseUrl}/cargarCarrito`))
                .catch(() => console.log('Error al guardar producto en carrito'))
        }
        else
            console.log('producto no encontrado')
    }
    else
    {
        console.log('carrito no creado')
        res.json()
    }
})

routerCarrito.delete('/:id/productos/:id_prod', (req,res) => {
    if(contenedorCarrito != null)
    {
        if(contenedorCarrito.getIdCarrito() == req.params.id)
        {
            contenedorCarrito.deleteById(req.params.id_prod)
                .then(() => res.redirect(`${req.baseUrl}/cargarCarrito`))
                .catch(() => console.log('Error al eliminar producto del carrito'))
        }
        else
            console.log('carrito no encontrado')
    }
    else
    {
        console.log('carrito no creado')
        res.json()
    }
})

module.exports = {
    contenedorCarrito : contenedorCarrito,
    routerCarrito : routerCarrito
}