const options = require('./options/sqlite3')    //objeto de configuración de Knex
const knex = require('knex')(options)
const Contenedor = require('./Contenedor')
const contenedorProductos = new Contenedor(knex,'productos');
(async function(){
    await contenedorProductos.init()
})();
const contenedorChat = new Contenedor(knex,'chat');
(async function(){
    await contenedorChat.init()
})();
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const { faker } = require('@faker-js/faker')
const app = express()
const server = http.createServer(app)
const io = new Server(server) //servidor de web socket

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/public', express.static(__dirname + '/public'))
app.use((err,req,res,next) => {
    console.error(err)
    res.status(500).send('Hubo algún error')
})


/*********************  utilización de faker **********************/
function createProductTest()
{
    return {
            title: faker.commerce.product(),
            price: faker.commerce.price(),
            thumbnail: faker.image.imageUrl(128,128,'objects',true)
    }
}

app.get('/api/productos-test', (req,res) => {
    const productos = []
    for (let i = 1; i <= 5; i++) {
        const product = createProductTest()
        productos.push({data: product})
        contenedorProductos.save(JSON.stringify(product))
    }
    const tituloTabla = 'Productos al azar'
    res.render('index', { productos , tituloTabla }) //para este caso solo muestro los 5 productos generados al azar
})

/******************************************************************/
app.get('/', (req,res) => {
    const tituloTabla = 'Lista de Productos'
    const productos = contenedorProductos.getAll()
    res.render('index', { productos , tituloTabla})
})

app.get('/dataChat', (req,res) => {
    const data = contenedorChat.getAll()
    res.json({data})
})

app.post('/productos', (req, res) => {   
    contenedorProductos.save(JSON.stringify(req.body))
        .then( () => {
            io.sockets.emit('producto-out', req.body)
            res.redirect('/')
        })
        .catch( () => res.send('Error to save'))
})

io.on('connection', (socket) => {
    
    socket.on('chat-in', data => {
        const date = new Date().toLocaleDateString()
        const time = new Date().toLocaleTimeString()
        const dataOut = {
            msn : data.msn,
            username : data.username,
            date,
            time
        };
        (async function(){
            await contenedorChat.save(JSON.stringify(dataOut))
        })();
        io.sockets.emit('chat-out', dataOut)
    })
  
})

const PORT = process.env.PORT || 8080
server.listen(8080, () => console.log(`PORT ${PORT}: server running.....`))