const log4js = require('./log4js')
const Conexion = require('./config')
const Contenedor = require('./daos/productos/ProductosDaoMongoDb')
const compression = require('compression') //gzip
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const Users = require('./models/user')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const rout  = require('./router/productos.router')
const routCarrito =  require('./router/carrito.router')
const routesLogin = require('./router/routesLogin')
const yargs = require('yargs')(process.argv.slice(2))
const { fork } = require('child_process')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/productos', rout.routerProducts)
app.use('/api/carrito', routCarrito.routerCarrito)
//app.use('/static', express.static(__dirname + '/public'))
//app.use(express.static(__dirname + '/public'))
app.use('/uploads', express.static('uploads'))
app.use((err,req,res,next) => {
    res.status(500).send('Hubo algún error')
})
app.use(compression())  //gzip

/***************** configuración librería yargs ********************/

const argv = yargs
    .default({
        port: 8080,
        admin: true,
        modo: 'fork'
    })
    .alias({
        p: 'port',
        a: 'admin'
    })
    .boolean('admin')
    .argv

const isAdmin = argv.admin;
const modo = argv.modo
let PORT = argv.port

/*********************** autenticación ************************/

//Registro de usuario
passport.use('signup', new LocalStrategy(
    {passReqToCallback: true},
    (req, username, password, done) => {
        Users.findOne({'username': username}, (err,user) => {
            if(err) {
                console.log('Error signup')
                return done(err)
            }
            if(user)
            {
                console.log('User already exists')
                return done(null,false)
            }
            const newUser = { username: username, password: createHash(password) }
            Users.create(newUser, (err,userWithID) => {
                if(err) 
                    return done(err) 
                console.log('User registration successfull!', userWithID)
                return done(null, userWithID)
            })      
        })
    }
))

//Inicio de sesión
passport.use('login', new LocalStrategy(
    (username, password, done) => {
        Users.findOne( {username}, (err,user) => {
            if(err) 
                return done(err)
            if(!user) 
            {
                console.log('User not found!')
                return done(null, false)   
            }
            if(!isValidPassword(user,password))
            {
                console.log('Invalid Password')
                return done(null,false)
            }
            return done(null,user)
        })
    }
))

function createHash(password) {
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10),
        null);
}

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password)
}

passport.serializeUser((user,done) => done(null, user._id))
passport.deserializeUser((id,done) => Users.findById(id, done))

app.use(session({
    secret: 'gabriel',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 600000, //10 minutos
        secure: false,
        httpOnly: false
    } 
}))

app.use(passport.initialize())
app.use(passport.session())

/******************************** rutas ********************************/
//app.get('/', routesLogin.getRoot);

app.get('/login', routesLogin.getLogin)
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin'}), routesLogin.postLogin)
app.get('/faillogin', routesLogin.getFailLogin)

app.get('/signup', routesLogin.getSignup)
app.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup'}), routesLogin.postSignup)
app.get('/failsignup', routesLogin.getFailSignup)

app.get('/logout', routesLogin.getLogout)

app.get('/', (req,res) => {
    log4js.loggerInfo.info(`Ruta: ${req.url} - Método: ${req.method}`)
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/dataProductos', (req,res) => {
    if(req.isAuthenticated())
    {
        const username = req.session.username
        const productos = rout.contenedor.getAll()
        res.json({productos, isAdmin, username})
    }
})

app.post('/cargarProductos', (req,res) => {
    rout.contenedor.save(req.body)
        .then(() => res.redirect('/'))
        .catch(() => res.send('Error al guardar producto'))
})

app.get('/api/randoms', (req,res) => {

    log4js.loggerInfo.info(`Ruta: ${req.url} - Método: ${req.method}`)
    const calculoRandoms = fork('./router/randoms')
    const cant = parseInt(req.query.cant)
    const strMessage = `Servidor express (NGINX) en puerto ${PORT} - <b>PID: ${process.pid}<b>`
    console.log(req.query.cant)
    console.log(cant)
    if(req.query.cant == undefined)
    {
        //se calculan 100.000.000 de números aleatorios
        calculoRandoms.send(100000000)
        res.send(strMessage) 
    }
    else
        if(!isNaN(cant))
        {   
            if(cant > 0)
            {
                calculoRandoms.send(cant)
                res.send(strMessage)
            }
            else
            {
                console.log('Error: La cantidad ingresada de números aleatorios a calcular es menor o igual a 1')  
                res.send('Error: La cantidad ingresada de números aleatorios a calcular es menor o igual a 1')  
            }   
        }
})

//rutas inexistentes en el server
app.get('/*', (req, res) => {
    log4js.loggerWarning.warn(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    res.send(`Error: Ruta no encontrada`)
})

/*********************************************************************************************/
if(modo == 'cluster' && cluster.isMaster) {
    console.log('numCPUs: ', numCPUs)
    console.log('PID master:', process.pid)

    for(let i=0; i < numCPUs; i++)
    {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log(`worker ${worker.process.pid} died`)
    })
}
else {

    app.get('/info', (req,res) => {
        
        log4js.loggerInfo.info(`Ruta: ${req.url} - Método: ${req.method}`)
        const info = `
            Argumentos de entrada: ${JSON.stringify(argv)}
            <br>
            <b>Cantidad de procesadores en el servidor: ${numCPUs}</b>
            <br>
            Sistema operativo: ${process.platform}
            <br>
            Versión de Node: ${process.version}
            <br>
            Memoria total reservada (rss): ${process.memoryUsage().rss}
            <br>
            Path de ejecución: ${process.execPath}
            <br>
            Id del proceso: ${process.pid}
            <br>
            Carpeta del proyecto: ${process.cwd()}
            <br>
        `
        res.send(info)
    })

    const server = app.listen(PORT, () => {
        console.log(`Servidor express escuchando en el puerto [${PORT}] - PID WORKER ${process.pid}`)
    })
    server.on('error', e => console.log('error en el server. ',e))
}