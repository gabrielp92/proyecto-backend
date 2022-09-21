const res = require('express/lib/response')

function getLogin(req,res){
    const strHTML = __dirname.replace('router','')
    if(req.isAuthenticated()) {
        //let user = req.user
        console.log('User logueado desde antes')
        res.sendFile(strHTML + "public\\index.html")
    }
    else   
    res.sendFile(strHTML + "public\\login.html")
}

function getSignup(req,res){
    const strSignupHTML = __dirname.replace('router','') + "public\\signup.html"
    res.sendFile(strSignupHTML)
}

function postLogin(req,res){
    console.log('entro a post de login usuario')
    let username = req.user.email
    console.log(username)
    console.log('User logueado por post')
    //req.session.username = username
    req.session.email = username
    req.session.admin = 1
    res.redirect('/')
}

function postSignup(req,res){
    console.log('User registrado!')
    //res.sendFile('Ok!!')
}

function getFailLogin(req,res){
    console.log('Error login')
    const strErrorHTML = __dirname.replace('router','') + "public\\loginError.html"
    res.sendFile(strErrorHTML)
}

function getFailSignup(req,res){
    console.log('Error signup')
    const strErrorHTML = __dirname.replace('router','') + "public\\signupError.html"
    res.sendFile(strErrorHTML)
}

function createHash(password) {
    return bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10),
        null);
}


module.exports = {
    getLogin,
    getSignup,
    postLogin,
    postSignup,
    getFailLogin,
    getFailSignup
}