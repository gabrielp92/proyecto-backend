const log4js = require('../log4js')

/*********** Creación de contenedor para productos ************/
const ProductosDaoMongoDb = require('../daos/productos/ProductosDaoMongoDb');
let contenedor = ProductosDaoMongoDb.getInstance()  //patrón singleton

/*****************************************************************/
function getProductController(request,response){
    log4js.loggerInfo.info(`Ruta: ${request.originalUrl} - Método: ${request.method}`)
    let productos = null
    if(request.params.id == undefined)
        productos = contenedor.getAll()
    else
    {
        productos = contenedor.getById(request.params.id)
        if(productos == null)
        {
            log4js.loggerError.error(`producto no encontrado`)
            response.status(404)
            response.json({error : 'producto no encontrado'})
            return
        }
    }
    response.json(productos)
}

function postProductController(request,response){
    log4js.loggerInfo.info(`Ruta: ${request.originalUrl} - Método: ${request.method}`);
    (async function(){
        await contenedor.save(request.body)
    })();
    response.json(contenedor.getAll()[contenedor.getAll().length-1])
}

function putProductController(request,response){
    log4js.loggerInfo.info(`Ruta: ${request.originalUrl} - Método: ${request.method}`);
    const producto = contenedor.getById(request.params.id);
    if(producto == null)
    {
        log4js.loggerError.error(`producto no encontrado`)
        response.status(404)
        response.json({error : 'producto no encontrado'})
        return
    }

    (async function(){
        await contenedor.update(producto, request.body) 
    })();

    log4js.loggerInfo.info('producto actualizado correctamente')
    response.json("actualiza producto con id:" + request.params.id)
}

function deleteProductController(request,response){
    log4js.loggerInfo.info(`Ruta: ${request.originalUrl} - Método: ${request.method}`);
    (async function(){
        await contenedor.deleteById(request.params.id)
    })();
    response.json()
}

module.exports = {
    contenedor : contenedor,
    getProductController,
    postProductController,
    putProductController,
    deleteProductController
}