const Contenedor = require('./Contenedor')
const contenedor = new Contenedor('productos.json');
(async function(){
    await contenedor.init()
})();
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/uploads', express.static('uploads'))
app.use((err,req,res,next) => {
    console.error(err)
    res.status(500).send('Hubo algún error')
})
/***************************************/

app.get('/', (req,res) => res.sendFile(__dirname + '/views/form.html'))

app.get('/productos', (req,res) => {

    const mensaje = 'Vista de Productos'
    const productos = contenedor.getAll()
    res.render('productos', { productos , mensaje })
})

app.post('/productos', (req, res) => {   
    contenedor.save(req.body)
        .then( () => res.redirect('/'))
        .catch( () => res.send('Error to save'))
})

const server = app.listen(PORT, () => {
    console.log(`Server listening [${PORT}]...`)
})

server.on('error', e => console.log('error en el server. ',e))
