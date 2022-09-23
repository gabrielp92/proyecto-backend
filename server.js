const Conexion = require('./config')
const Contenedor = require('./daos/productos/ProductosDaoMongoDb')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const Users = require('./models/user')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const rout  = require('./router/productos.router')
const routCarrito =  require('./router/carrito.router')
const routesLogin = require('./router/routesLogin')
const app = express()
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

const isAdmin = true;

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

const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
    console.log(`Server listening [${PORT}]...`)
})
server.on('error', e => console.log('error en el server. ',e))
