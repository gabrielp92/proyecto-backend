const Contenedor = require('./Contenedor');

const contenedor = new Contenedor('productos.json');

(async function(){

    await contenedor.init()
    const id1 = await contenedor.save({title: 'Hamlet', price: 25.99, thumbnail: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/7460/9780746096116.jpg'})
    const id2 = await contenedor.save({title: 'Frankenstein', price: 42.99, thumbnail: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9781/4959/9781495937248.jpg'})
    const id3 = await contenedor.save({title: 'Edipo Rey', price: 18.50, thumbnail: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/3655/9780365552024.jpg'})

    console.log(contenedor.getById(id1))
    console.log(contenedor.getById(id2))
    console.log(contenedor.getById(id3))
    console.log(contenedor.getById(2490))
    await contenedor.deleteById(id2)    
    await contenedor.deleteById(id2)
    console.log(contenedor.getAll())
    await contenedor.deleteAll()
    console.log(contenedor.getAll())
    await contenedor.save({title: 'Frankenstein', price: 42.99, thumbnail: 'https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9781/4959/9781495937248.jpg'})
})();