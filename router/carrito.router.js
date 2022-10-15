const log4js = require('./log4js')
const rout  = require('./productos.router');
const CarritoDaoMongoDb = require('../daos/carrito/CarritoDaoMongoDb');
const express = require('express');
const { Router } = express
const routerCarrito = Router()
let contenedorCarrito = null

routerCarrito.post('/', (req,res) => {
    log4js.loggerInfo.info(`Ruta: ${req.url} - Método: ${req.method}`)
    contenedorCarrito = new CarritoDaoMongoDb();
    (async function(){
        await contenedorCarrito.init()
        console.log('carrito creado')
    })();
    res.json(contenedorCarrito.getIdCarrito())
})

routerCarrito.delete('/:id', (req,res) => {
    log4js.loggerInfo.info(`Ruta: ${req.url} - Método: ${req.method}`)
    if(contenedorCarrito != null)
    {
        contenedorCarrito.clearCart(req.params.id)
            .then(() => res.redirect(`${req.baseUrl}/cargarCarrito`))
            .catch(() => log4js.loggerError.error('Error al eliminar carrito'))
    }
    else
    {
        log4js.loggerError.error('carrito no creado')
        res.json()
    }
})

routerCarrito.get('/cargarCarrito', (req,res) => {
    log4js.loggerInfo.info(`Ruta: ${req.url} - Método: ${req.method}`)
    if(contenedorCarrito != null)
    {
        res.json(contenedorCarrito.getAll(contenedorCarrito.getIdCarrito()))
    }
    else
    {
        log4js.loggerError.error('carrito no creado')
        res.json()
    }
})

routerCarrito.get('/:id/productos', (req,res) => {
    log4js.loggerInfo.info(`Ruta: ${req.url} - Método: ${req.method}`)
    if(contenedorCarrito != null)
        res.json(contenedorCarrito.getAll(req.params.id))
    else
    {
        log4js.loggerError.error('carrito no creado')
        res.json()
    }
})

routerCarrito.post('/cargarCarritoPorId', (req,res) => {
    log4js.loggerInfo.info(`Ruta: ${req.url} - Método: ${req.method}`)
    if(contenedorCarrito != null)
    {       
        const producto = rout.contenedor.getById(req.body.productoId)
        if(producto != null)
        {   console.log('entre en cargarCarritoPorId')
            console.log(producto)
            contenedorCarrito.save(producto)
            .then(() => res.redirect('/'))
            .catch(() => log4js.loggerError.error('Error al guardar producto en carrito'))
        }
        else
            log4js.loggerError.error('producto no encontrado')
    }
    else
    {
        log4js.loggerError.error('carrito no creado')
        res.json()
    }
})

routerCarrito.post('/:id/productos', (req,res) => {
    log4js.loggerInfo.info(`Ruta: ${req.url} - Método: ${req.method}`)
    if(contenedorCarrito != null)
    {
        const producto = rout.contenedor.getById(req.params.id)
        if(producto != null)
        {
            contenedorCarrito.save(producto)
                .then(() => res.redirect(`${req.baseUrl}/cargarCarrito`))
                .catch(() => log4js.loggerError.error('Error al guardar producto en carrito'))
        }
        else
            log4js.loggerError.error('producto no encontrado')
    }
    else
    {
        log4js.loggerError.error('carrito no creado')
        res.json()
    }
})

routerCarrito.delete('/:id/productos/:id_prod', (req,res) => {
    log4js.loggerInfo.info(`Ruta: ${req.url} - Método: ${req.method}`)
    if(contenedorCarrito != null)
    {
        if(contenedorCarrito.getIdCarrito() == req.params.id)
        {
            contenedorCarrito.deleteById(req.params.id_prod)
                .then(() => res.redirect(`${req.baseUrl}/cargarCarrito`))
                .catch(() => log4js.loggerError.error('Error al eliminar producto del carrito'))
        }
        else
            log4js.loggerError.error('carrito no encontrado')
    }
    else
    {
        log4js.loggerError.error('carrito no creado')
        res.json()
    }
})

module.exports = {
    contenedorCarrito : contenedorCarrito,
    routerCarrito : routerCarrito
}