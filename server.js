const Conexion = require('./config')
const Contenedor = require('./daos/productos/ProductosDaoMongoDb');
const express = require('express');
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Users = require('./models/user')

const rout  = require('./router/productos.router');
const routCarrito =  require('./router/carrito.router');

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/productos', rout.routerProducts)
app.use('/api/carrito', routCarrito.routerCarrito)
const routes = require('./router/routes')

//app.use('/static', express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/public'))
app.use('/uploads', express.static('uploads'))
app.use((err,req,res,next) => {
    console.error(err)
    res.status(500).send('Hubo algún error')
})

const isAdmin = true;

/**************************************/
//Registro de usuario
passport.use('signup', new LocalStrategy(
    {passReqToCallback: true},
    (req, email, password, done) => {
        Users.findOne({'email': email}, (err,user) => {
            if(err) {
                console.log('Error signup')
                return done(err)
            }
            if(user)
            {
                console.log('User already exists')
                return done(null,false)
            }

            const newUser = { email, password }
  
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
    (email, password, done) => {
        Users.findOne( {email}, (err,user) => {
            console.log('user:')
            console.log(user)
            if(err) 
                return done(err)
            if(!user) 
            {
                console.log('User not found!')
                return done(null, false)   
            }
            return done(null,user)
        })
    }
))

passport.serializeUser((user,done) => done(null, user._id));
passport.deserializeUser((id,done) => Users.findById(id, done));

app.use(session({
    secret: 'gabriel',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 30000,
        secure: false,
        httpOnly: false
    }
}));

app.use(passport.initialize());
app.use(passport.session());

/****************************************/
//rutas
app.get('/login', routes.getLogin);
app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin'}), routes.postLogin);
app.get('/faillogin', routes.getFailLogin);

app.get('/signup', routes.getSignup);
app.post('/signup', passport.authenticate('signup', { failureRedirect: '/failsignup'}), routes.postSignup);
app.get('/failsignup', routes.getFailSignup);

app.get('/logout', (req,res) => {
    req.session.destroy(err => {
        if(!err) 
        {
            res.send('logout ok')
        }
        else res.send({status: 'Logout error', body:err})
    })
})

/*****************************************/

app.get('/', (req,res) => {
    res.sendFile('/index.html')
})

app.get('/dataProductos', (req,res) => {
    //const username = req.session.username
    const username = req.session.email
    const productos = rout.contenedor.getAll()
    res.json({productos, isAdmin, username})
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
