const cluster = require('cluster')
const http = require('http')
const numCPUs = require('os').cpus().length

if(cluster.isMaster) {
    console.log(`Master ${process.pid} is running`)
    for(let i=0; i < numCPUs;i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker,code,signal) => {
        console.log(`worker ${worker.process.pid} died`)
    })
} 
else {
    http.createServer((req,res) => {
		console.log(`entro en el proceso ${process.pid}`)
        res.writeHead(200)
        res.end(`Hello ${process.pid}`)
	}).listen(8081)
    console.log(`Worker ${process.pid} started!`)
}

process.on('message', cant => crearRandoms(cant))

function crearRandoms(cant)
{
    for (let i = 1; i <= cant; i++) {
        console.log(Math.floor(Math.random() * 1000 + 1))   
    }
}