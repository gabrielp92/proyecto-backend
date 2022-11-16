const axios = require('axios')

function getAxios(id){
    axios.get(`http://127.0.0.1:8080/api/productos/${id}`)
        .then(response => console.log(response.data))
        .catch(e => console.log(e))
        .finally(() => console.log('END GET'))
}

function postAxios(){
   
    axios.post('http://127.0.0.1:8080/api/productos',
    {
        "nombre":"ProductoAxios",
        "descripcion":"desde post Axios",
        "código":91028442,
        "stock":62,
        "precio":4844,
        "foto":"https://icdn.dtcn.com/image/digitaltrends_es/macbook-m1-01-768x512.jpg"
    }
)
        .then(response => console.log(response))
        .catch(e => console.log(e))
        .finally(() => console.log('END POST'))   
}

module.exports = {
    getAxios,
    postAxios
}