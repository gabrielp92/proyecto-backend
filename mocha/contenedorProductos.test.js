const contenedorProductos = require('../daos/productos/ProductosDaoMongoDb')
const assert = require('assert').strict

describe('Test de integracion de contenedorProductos', function() {

    it('Must return empty', () => {
        const contenedor = contenedorProductos.getInstance()
        assert.strictEqual(contenedor.getAll().length, 0)
    })

    it('Agrego al contenedor', () => {
        const contenedor = contenedorProductos.getInstance()
        contenedor.save({
            "nombre":"ProductoTest",
            "descripcion":"desde Test",
            "código":910286662,
            "stock":22,
            "precio":475,
            "foto":"https://icdn.dtcn.com/image/digitaltrends_es/macbook-m1-01-768x512.jpg"
        })
        assert.strictEqual(contenedor.getAll().length, 1)
    })
})