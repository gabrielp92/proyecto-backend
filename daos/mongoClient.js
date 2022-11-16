const mongoose = require('mongoose')
const DbClient = require('./dbClient')
const Config = require('../config/config')

class MongoClient extends DbClient{

    constructor(){
        super()
        this.connected = false
        this.client = mongoose
    }

    async connect(){
        try {
            await this.client.connect(Config.db.connectString)
            this.connected = true
            console.log('DB mongo connected');
        } catch (e) {
            throw new Error('Error connect mongo atlas', e)
        }
    }

    async disconnect(){
        try {
            await this.client.connection.close()
            this.connected = false
            console.log('DB mongo disconnected');
        } catch (e) {
            throw new Error('Error disconnect mongo atlas', e)
        }
    }

}

module.exports = MongoClient