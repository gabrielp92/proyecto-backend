const twilio = require('twilio')

const accountSID = 'AC3c05cf93de2229614911f83015b5bebe'
const authToken = 'f7d177d1aa543385972b976067d133f6'

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