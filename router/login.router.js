const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser')
const session = require('express-session')
const express = require('express')
const MongoStore = require('connect-mongo')
const { Router } = express
const routerLogin = Router()

const mongoose = require('mongoose')
const Users = require('../models/user')


//Inicio de sesión
passport.use('login', new localStrategy(
    (email, password, done) => {
        Users.findOne( (email), (err,user) => {
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
    
    //Registro de usuario
passport.use('signup', new localStrategy({passReqToCallback: true},
    (req, email, password, done) => {
        Users.create({email, password}, (err,userWithID) => {
            if(err) return done(err) 
            console.log('User registration successfull!', userWithID)
            return done(null, userWithID)
        })        
    }
))
        
routerLogin.use(cookieParser())

passport.serializeUser((user,done) => { done(null, user._id) })
passport.deserializeUser((id,done) => Users.findById(id, done))


routerLogin.use(session({
    secret: 'desafio',
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 200
    },
    rolling: true,
    resave: false,
    saveUninitialized: false
}))

routerLogin.use(passport.initialize())
routerLogin.use(passport.session())

//////////////////////////////
/*
routerLogin.use(session({
    store: new MongoStore({
        mongoUrl: 'mongodb+srv://GabrielP92:espORA36511196@cluster0.jbxpxs5.mongodb.net/proyectoDB?retryWrites=true&w=majority'
  
    }),
    secret: 'desafio',
    resave: false,
    saveUninitialized: true
}))*/

////////////////////////////

/*
function auth(req,res,next)
{
    if(req.session.admin) {
        return next()
    }
    return res.status(401).send('No autorizado')
}*/

//agrego autenticación
routerLogin.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin'} ), (req,res) => {
    console.log('entro a post de login usuario')
    let username = req.user
    console.log(username)
    console.log('User logueado por post')
    //req.session.username = username
    req.session.email = username
    req.session.admin = 1
    res.redirect('/')
})

routerLogin.get('/faillogin', (req,res) => {
    console.log('Error login')
    const strErrorHTML = __dirname.replace('router','') + "public\\loginError.html"
    res.sendFile(strErrorHTML)
})

routerLogin.get('/signup', (req,res) => {
    const strSignupHTML = __dirname.replace('router','') + "public\\signup.html"
    res.sendFile(strSignupHTML)
})

routerLogin.post('/signup', passport.authenticate('signup', { failureRedirect: '/failSignup'}), (req,res) => {
    console.log('User registrado!')
    res.sendFile('Ok!!')
})


function checkAuthentication(req,res,next) {
    if(req.isAuthenticated()) next()
    else 
        //res.redirect(que vaya al login)
        console.log('yendo al login porque debe estar logueado para ingresar a esta página')
}

routerLogin.get('/private', checkAuthentication, (req,res) => {
    const { user } = req
    console.log('User: ', user)
    res.send('<h1>Solo pudiste entrar porque estás logueado!!</h1>')

})

routerLogin.get('/logout', (req,res) => {
    req.session.destroy(err => {
        if(!err) 
        {
            res.send('logout ok')
        }
        else res.send({status: 'Logout error', body:err})
    })
})

module.exports = {
    routerLogin: routerLogin
} 