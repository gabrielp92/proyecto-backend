const Contenedor = require('./Contenedor');
/*
let contenedor = new Contenedor('productos.txt');
(async function(){
    await contenedor.init()
})();*/

const express = require('express')
const multer = require('multer')
const routerProducts  = require('./router/productos.router')
const app = express()
const PORT = process.env.PORT || 8080
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/productos', routerProducts)
app.use('/static', express.static(__dirname + '/public'))
app.use('/uploads', express.static('uploads'))
app.use((err,req,res,next) => {
    console.error(err)
    res.status(500).send('Hubo algún error')
})

// configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, file.originalname)
})
const upload = multer({storage})

/***************************************/

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.post('/uploadfile', upload.single('productos'), (req, res, next) => {
    const file = req.file
    if(!file) {
        const error = new Error('Por favor, cargue el archivo')
        error.httpStatusCode = 400
        return next(error)
    }

    //Se utiliza la clase Contenedor para que el archivo persista en memoria
    const contenedor = new Contenedor(req.file.originalname);
    //contenedor = new Contenedor(req.file.originalname);
    (async function(){
        console.log('desde server')
        await contenedor.init()
        res.send(contenedor.getAll())
    })();
})

const server = app.listen(PORT, () => {
    console.log(`Server listening [${PORT}]...`)
})

server.on('error', e => console.log('error en el server. ',e))