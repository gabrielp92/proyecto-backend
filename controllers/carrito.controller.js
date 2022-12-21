const log4js = require('../config/log4js')
const rout = require('./productos.controller')
const CarritoDaoMongoDb = require('../daos/carrito/CarritoDaoMongoDb');
const mailGmail = require('../scripts/mailGmail')
const OrdenModel = require('../models/orden.model')
let username = undefined;
let contenedorCarrito = CarritoDaoMongoDb.getInstance() //patrón singleton

function postCarritoController(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    res.json(contenedorCarrito.getIdCarrito())
}

function deleteCarritoController(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
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
}

function getCargarCarritoController(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    if(contenedorCarrito != null)
    {
        res.json(contenedorCarrito.getAll(contenedorCarrito.getIdCarrito()))
    }
    else
    {
        log4js.loggerError.error('carrito no creado')
        res.json()
    }
}

function getProductosCarritoController(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    if(contenedorCarrito != null)
        res.json(contenedorCarrito.getAll(req.params.id))
    else
    {
        log4js.loggerError.error('carrito no creado')
        res.json()
    }
}

function postCargarCarritoPorIdController(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    if(contenedorCarrito != null)
    {       
        const producto = rout.contenedor.getById(req.body.productoId)
        if(producto != null)
        {   log4js.loggerInfo.info('entré en cargarCarritoPorIdController')
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
}

function postCargarProductoCarritoController(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
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
}

function deleteProductoCarritoController(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
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
}

function setUsername(nombre)
{
    username = nombre
}

function generarOrden(productosEnCarrito, user)
{
    let strItems = ""
    productosEnCarrito.forEach(prodCarrito => {
        strItems += `${prodCarrito.nombre}(${prodCarrito.descripcion}) $${prodCarrito.precio} -`
    });

    let cantOrders = 0;
    OrdenModel.estimatedDocumentCount((err, numOfDocs) => {
        if(err) throw(err);
        cantOrders = numOfDocs
      });
    
    cantOrders += 1;
    const orden = {
        items: strItems,
        numero: cantOrders,
        email: user
    }
    let modeloOrden = new OrdenModel(orden);
    modeloOrden.save();
    return orden;
}

function postFinalizarCompra(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    const productosEnCarrito = contenedorCarrito.getAll(contenedorCarrito.getIdCarrito())
    if(productosEnCarrito.length != 0)
    {
        console.log('username: ' + username)
        const orden = generarOrden(productosEnCarrito, username)
        mailGmail.enviarMail(username, productosEnCarrito, orden)
    }
    res.json('Compra realizada exitosamente!')
}

module.exports = {
    contenedorCarrito : contenedorCarrito,
    postCarritoController,
    deleteCarritoController,
    getCargarCarritoController,
    getProductosCarritoController,
    postCargarCarritoPorIdController,
    postCargarProductoCarritoController,
    deleteProductoCarritoController,
    setUsername,
    postFinalizarCompra
}