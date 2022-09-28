const config = require('./config-entorno')
const express = require('express')
console.log(config)

const app = express()

console.log(`NODE ENV=${config.NODE_ENV}`)

app.get('/', (req,res) => res.send('OK'))

app.listen(config.PORT, config.HOST, () => {
    console.log(`App listening on hhtp://${config.HOST}:${config.PORT}`)
})