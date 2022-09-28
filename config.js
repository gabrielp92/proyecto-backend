require('dotenv').config()

/******************* Conexión a MongoDb remoto ****************/
const mongoose = require('mongoose')
const url = process.env.URL
mongoose.connect(url, { useNewUrlParser:true, useUnifiedTopology:true }, err => {
    if(err) {
        console.log(err);
        return
    }
    console.log('DB connected');
})