const Contenedor = require('./Contenedor');
const express = require('express')
const multer = require('multer')
const rout  = require('./router/productos.router');
const app = express()
const PORT = process.env.PORT || 8080
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/productos', rout.routerProducts)
app.use('/static', express.static(__dirname + '/public'))
app.use('/uploads', express.static('uploads'))
app.use((err,req,res,next) => {
    console.error(err)
    res.status(500).send('Hubo algún error')
})

// configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, 'productos.txt')
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
    if(rout.contenedor == null)  
        rout.contenedor = new Contenedor(req.file.filename);
    
    (async function(){
        await rout.contenedor.init()
        res.send(rout.contenedor.getAll())
    })();
})

const server = app.listen(PORT, () => {
    console.log(`Server listening [${PORT}]...`)
})

server.on('error', e => console.log('error en el server. ',e))
