const carritoController = require('../controllers/carrito.controller')
const express = require('express');
const { Router } = express
const routerCarrito = new Router()

routerCarrito.post('/', carritoController.postCarritoController)

routerCarrito.delete('/:id', carritoController.deleteCarritoController)

routerCarrito.get('/cargarCarrito', carritoController.getCargarCarritoController)

routerCarrito.get('/:id/productos', carritoController.getProductosCarritoController)

routerCarrito.post('/cargarCarritoPorId', carritoController.postCargarCarritoPorIdController)

routerCarrito.post('/:id/productos', carritoController.postCargarProductoCarritoController)

routerCarrito.delete('/:id/productos/:id_prod', carritoController.deleteProductoCarritoController)

routerCarrito.post('/finalizarCompra', carritoController.postFinalizarCompra)

module.exports = {
    contenedorCarrito : carritoController.contenedorCarrito,
    setUsername : carritoController.setUsername,
    routerCarrito : routerCarrito
}