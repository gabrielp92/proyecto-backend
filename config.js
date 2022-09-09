/******************* Conexión a MongoDb remoto ****************/
const mongoose = require('mongoose')
const url = 'mongodb+srv://GabrielP92:espORA36511196@cluster0.jbxpxs5.mongodb.net/proyectoDB?retryWrites=true&w=majority'
mongoose.connect(url, {}, err => {
    if(err) {
        console.log(err);
        return
    }
    console.log('DB connected');
})