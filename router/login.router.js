const cookieParser = require('cookie-parser')
const session = require('express-session')
const express = require('express')
const MongoStore = require('connect-mongo')
const { Router } = express
const routerLogin = Router()

const DB = [
    {username: 'nicolas', password:'12345'},
    {username: 'ignacio', password:'secret'}
]

routerLogin.use(cookieParser())

routerLogin.use(session({
    store: new MongoStore({mongoUrl: 'mongodb://localhost/sessions'}),
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}))

function auth(req,res,next)
{
    if(req.session.admin) {
        return next()
    }
    return res.status(401).send('No autorizado')
}

routerLogin.post('/login', (req,res) => {
    console.log('entro a post de login usuario')
    let username = req.body.usuario
    if(!username)
        return res.send('Login Failed')
    username = username.toLowerCase()
    const data = DB.find(d => d.username == username)
    if(!data)
        return res.send('Login failed with pass')
    
    req.session.username = username
    req.session.admin = 1
    res.redirect('/')
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