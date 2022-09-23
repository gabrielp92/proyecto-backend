/******************* Conexión a MongoDb remoto ****************/
const mongoose = require('mongoose')
const url = 'mongodb+srv://GabrielP92:espORA36511196@cluster0.jbxpxs5.mongodb.net/proyectoDB?retryWrites=true&w=majority'
//const url = 'mongodb://GabrielP92:espORA36511196@ac-bpwn8t0-shard-00-00.jbxpxs5.mongodb.net:27017,ac-bpwn8t0-shard-00-01.jbxpxs5.mongodb.net:27017,ac-bpwn8t0-shard-00-02.jbxpxs5.mongodb.net:27017/proyectoDB?ssl=true&replicaSet=atlas-19wuma-shard-0&authSource=admin&retryWrites=true&w=majority'

mongoose.connect(url, { useNewUrlParser:true, useUnifiedTopology:true }, err => {
    if(err) {
        console.log(err);
        return
    }
    console.log('DB connected');
})