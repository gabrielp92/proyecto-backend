const productosController = require('../controllers/productos.controller')
const express = require('express')
const { Router } = express
const routerProducts = new Router()

routerProducts.get('/:id?',  productosController.getProductController)

routerProducts.post('/', productosController.postProductController)

routerProducts.put('/:id', productosController.putProductController)

routerProducts.delete('/:id', productosController.deleteProductController)

module.exports = {
    contenedor : productosController.contenedor,
    routerProducts : routerProducts
}