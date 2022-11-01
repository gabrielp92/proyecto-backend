require('dotenv').config()
const twilio = require('twilio')

const accountSID = process.env.ACCOUNTSID
const authToken = process.env.AUTHTOKEN

const phoneServer = '+14155238886'
const phoneAdmin = '+5492932441606'

const client = twilio(accountSID, authToken)

function enviarWhatsapp(userBuyer)
{
    client.messages.create({
        body: `Nuevo pedido de ${userBuyer}`,
        from: `whatsapp:${phoneServer}`,
        to: `whatsapp:${phoneAdmin}`
    })
        .then( res => console.log(res))
        .catch( err => console.log(err))
}

module.exports = {
    enviarWhatsapp
}