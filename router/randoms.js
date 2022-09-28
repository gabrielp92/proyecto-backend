process.on('message', cant => crearRandoms(cant))

function crearRandoms(cant)
{
    for (let i = 1; i <= cant; i++) {
        console.log(Math.floor(Math.random() * 1000 + 1))   
    }
}