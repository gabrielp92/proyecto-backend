const Contenedor = require('./Contenedor');
const express = require('express');
const rout  = require('./router/productos.router');
const routCarrito =  require('./router/carrito.router');
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/productos', rout.routerProducts)
app.use('/api/carrito', routCarrito.routerCarrito)
//app.use('/static', express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public'))
app.use('/uploads', express.static('uploads'))
app.use((err,req,res,next) => {
    console.error(err)
    res.status(500).send('Hubo algún error')
})

const isAdmin = true

app.get('/', (req,res) => {
    res.sendFile('/index.html')
})

app.get('/dataProductos', (req,res) => {
    const productos = rout.contenedor.getAll()
    res.json({productos, isAdmin})
})

app.post('/cargarProductos', (req,res) => {
    rout.contenedor.save(req.body)
        .then(() => res.redirect('/'))
        .catch(() => res.send('Error al guardar producto'))
})

const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
    console.log(`Server listening [${PORT}]...`)
})
server.on('error', e => console.log('error en el server. ',e))
