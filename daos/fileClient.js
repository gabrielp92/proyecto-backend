const DbClient = require('./dbClient')
const Config = require('../config/config')
const fs = require('fs')

class FileClient extends DbClient{

    constructor(filename){
        super()
        this.filename = filename
    }

    async connect(){
        console.log('File initialized')
    }

    async disconnect(){
        console.log('File finished')
    }

    async read(){
        return JSON.parse(await fs.promises.readFile(this.filename, 'utf-8'))
    }

    async save(data){
        await fs.promises.writeFile(this.filename, JSON.stringify(data))   
    }

}

module.exports = FileClient