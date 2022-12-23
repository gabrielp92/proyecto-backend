const log4js = require('./config/log4js')
const compression = require('compression') //gzip
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const Users = require('./models/user.model')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const rout  = require('./router/productos.router')
const routCarrito =  require('./router/carrito.router')
const routesLogin = require('./router/routesLogin')
const yargs = require('yargs')(process.argv.slice(2))
const http = require('http')
const { Server } = require('socket.io')
const { fork } = require('child_process')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const app = express()
const server = http.createServer(app)
const io = new Server(server) //servidor de web socket
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/productos', rout.routerProducts)
app.use('/api/carrito', routCarrito.routerCarrito)
app.use(express.static(__dirname + '/public')) 
//app.use(express.static('./public'))
//app.use('/public', express.static(__dirname + '/public'))
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
const PORT = process.env.PORT || argv.port

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
            if(user) {
                console.log('User already exists')
                return done(null,false)
            }
            if(password != req.body.repassword){
                console.log('las contraseñas no coinciden')
                return done(err)
            }
            const newUser = { name: req.body.name, lastname: req.body.lastname, phone: req.body.phone, username: username, password: createHash(password) }
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
            routCarrito.setUsername(username)
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

/******************************* chat - websocket **************************/
const MensajesDaoMongoDb = require('./daos/mensajes/MensajesDaoMongoDb')
const contenedorChat = MensajesDaoMongoDb.getInstance()

app.get('/chat', (req,res) => {
    res.render('index')
})

app.get('/dataChat', (req,res) => {
    const data = contenedorChat.getAll()
    res.json({data})
})

io.on('connection', (socket) => {
    
    socket.on('chat-in', data => {
        const fecha = new Date().toLocaleDateString()
        const hora = new Date().toLocaleTimeString()
        const tipo = isAdmin ? 'sistema' : 'usuario'
        const dataOut = {
            mensaje : data.msn,
            email : data.username,
            fecha,
            hora,
            tipo
        };
        (async function(){
            await contenedorChat.save(dataOut)
        })();
        io.sockets.emit('chat-out', dataOut)
    })
  
})

/******************************** rutas ********************************/
//app.get('/', routesLogin.getRoot)

app.get('/login', routesLogin.getLogin)
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin'}), routesLogin.postLogin)
app.get('/faillogin', routesLogin.getFailLogin)

app.get('/signup', routesLogin.getSignup)
app.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup'}), routesLogin.postSignup)
app.get('/failsignup', routesLogin.getFailSignup)

app.get('/logout', routesLogin.getLogout)


app.get('/', (req,res) => {
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    if(req.isAuthenticated())
    {
        res.sendFile(__dirname + '/public/index.html')
    }
    else
    {
        res.sendFile(__dirname + '/public/login.html')
    }
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

    server.listen(PORT, () => {
        console.log(`Servidor express escuchando en el puerto [${PORT}] - PID WORKER ${process.pid}`)
    })
    server.on('error', e => console.log('error en el server. ',e))
}