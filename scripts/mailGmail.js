require('dotenv').config()
const { createTransport } = require('nodemailer');
const ejs = require('ejs')
const mailAdmin = 'gpaez1992@gmail.com'

const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: mailAdmin,
        pass: process.env.GMAILPASS
    }
});

function enviarMail(userBuyer, data, dataOrden)
{
    ejs.renderFile(__dirname + '/index.ejs', { data, dataOrden })
    .then(body => {  
        transporter.sendMail({
            from: mailAdmin,
            to: [mailAdmin],
            subject: `Nuevo pedido de ${userBuyer}`,
            html: body
        })
            .then(r => console.log(r))
            .catch(e => console.log(e))
    })
}

function enviarMailSignup(data)
{
    ejs.renderFile(__dirname + '/indexSignup.ejs', { data })
    .then(body => {  
        transporter.sendMail({
            from: mailAdmin,
            to: [mailAdmin],
            subject: `Nuevo usuario registrado: ${data.username}`,
            html: body
        })
            .then(r => console.log(r))
            .catch(e => console.log(e))
    })
}

module.exports = {
    enviarMail,
    enviarMailSignup
}
