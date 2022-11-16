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

function enviarMail(userBuyer, data)
{
    ejs.renderFile(__dirname + '/index.ejs', { data })
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

module.exports = {
    enviarMail
}
