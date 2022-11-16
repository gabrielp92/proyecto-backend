require('dotenv').config()

const Config = {
    db: {
        name: 'db_mongoAtlas',
        collection: 'todas',
        connectString: process.env.URL,
        projection: {__v: 0}
    }
}

module.exports = Config