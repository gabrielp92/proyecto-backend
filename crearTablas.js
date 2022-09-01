const options = require('./options/sqlite3')
const knex = require('knex')(options)

/**************** tabla productos ******************/
knex.schema.createTable('productos', table => {

    table.increments('id')
    table.json('data')    
})
    .then(() => console.log('tabla productos creada'))
    .catch(error => {
        console.log(error)
        throw error
    })
    .finally(() => knex.destroy())

/****************** tabla chats ********************/
knex.schema.createTable('chat', table => {

    table.increments('id')
    table.json('data')
})
    .then(() => console.log('tabla chat creada'))
    .catch(error => {
        console.log(error)
        throw error
    })
    .finally(() => knex.destroy())

