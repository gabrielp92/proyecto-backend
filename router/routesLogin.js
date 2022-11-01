const res = require('express/lib/response')
const log4js = require('../log4js')
let username = undefined;

/*
function getRoot(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    const strHTML = __dirname.replace('router','')
    if(req.isAuthenticated()) 
        res.sendFile(strHTML + "public\\index.html")
    else
        res.redirect('/login')
}*/

function getLogin(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    const strHTML = __dirname.replace('router','')
    if(req.isAuthenticated()) {
        log4js.loggerInfo.info('User logueado desde antes')
        res.sendFile(strHTML + "public\\index.html")
    }
    else   
        res.sendFile(strHTML + "public\\login.html")
}

function getSignup(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    const strSignupHTML = __dirname.replace('router','') + "public\\signup.html"
    res.sendFile(strSignupHTML)
}

function postLogin(req,res){
    log4js.loggerInfo.info('entro a post de login usuario')
    username = req.user.username
    log4js.loggerInfo.info(`${username}`)
    log4js.loggerInfo.info('User logueado por post')
    req.session.username = username
    req.session.admin = 1
    res.redirect('/')
}

function postSignup(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    log4js.loggerInfo.info('User registrado!')
    req.session.username = req.user.username
    res.redirect('/login')
}

function getFailLogin(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    console.log('Error login')
    const strErrorHTML = __dirname.replace('router','') + "public\\loginError.html"
    res.sendFile(strErrorHTML)
}

function getFailSignup(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    console.log('Error signup')
    const strErrorHTML = __dirname.replace('router','') + "public\\signupError.html"
    res.sendFile(strErrorHTML)
}

function getLogout(req,res){
    log4js.loggerInfo.info(`Ruta: ${req.originalUrl} - Método: ${req.method}`)
    req.logout( err => {
        if(!err) 
        {
            res.send('logout ok')
        }
        else 
            res.send({status: 'Logout error', body:err}) 
    })
}

module.exports = {
   // getRoot,
    getLogin,
    getSignup,
    postLogin,
    postSignup,
    getFailLogin,
    getFailSignup,
    getLogout,
    username
}