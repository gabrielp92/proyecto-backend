const log4js = require('../log4js')

/*********** Creación de contenedor para productos ************/
const ProductosDaoMongoDb = require('../daos/productos/ProductosDaoMongoDb');
let contenedor = ProductosDaoMongoDb.getInstance()  //patrón singleton

/*****************************************************************/
function getProductController(id){ 
    let productos = null
    if(id == undefined)
        productos = contenedor.getAll()
    else
    {
        productos = contenedor.getById(id)
        if(productos == null)
        {
            log4js.loggerError.error(`producto no encontrado`)
            response.status(404)
            response.json({error : 'producto no encontrado'})
            return
        }
    }
    return productos
}

function postProductController({data}){
    (async function(){
        return await contenedor.save(data)
    })();
}

function putProductController(id, {data}){
    const producto = contenedor.getById(id);
    if(producto == null)
    {
        log4js.loggerError.error(`producto no encontrado`)
        response.status(404)
        response.json({error : 'producto no encontrado'})
        return
    }

    (async function(){
        return await contenedor.update(producto, data) 
    })();
}

function deleteProductController(id){
    (async function(){
        return await contenedor.deleteById(id)
    })();
}

module.exports = {
    contenedor : contenedor,
    getProductController,
    postProductController,
    putProductController,
    deleteProductController
}