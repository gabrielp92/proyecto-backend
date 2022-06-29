/*********************** creación de productos *************************/
const Contenedor = require('./Contenedor');
const contenedor = new Contenedor('productos.txt');
(async function(){
    await contenedor.init()
    await contenedor.save({title: 'Hamlet', price: 25.99, thumbnail: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/7460/9780746096116.jpg'})
    await contenedor.save({title: 'Frankenstein', price: 42.99, thumbnail: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9781/4959/9781495937248.jpg'})
    await contenedor.save({title: 'Edipo Rey', price: 18.50, thumbnail: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/3655/9780365552024.jpg'})
})();

/************************ Server ***************************/

const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080

app.get('/productos', (request,response) => {
    response.send(contenedor.getAll())
})

app.get('/productoRandom', (request,response) => {
    const index = Math.round(Math.random() * (contenedor.getAll().length - 1))
    response.send(contenedor.getAll()[index])
})

const server = app.listen(PORT, () => {
    console.log(`Server listening [${PORT}]...`)
})

server.on('error', e => console.log('error en el server. ',e))