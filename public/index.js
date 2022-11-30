let isAdmin = null; 
let username = undefined;
crearOyenteBtnLogout(); 
cargarProductos();
cargarCarrito();

function crearOyenteBtnLogout(){
  const buttonLogout = document.getElementById('btnLogout')
  buttonLogout.onclick = (e) => {oyenteButtonLogout(e)}
}

function cargarOyenteButtons(producto)
{
  const buttonActualizar = document.getElementById(`actualizar${producto._id}`)
  const buttonEliminar = document.getElementById(`eliminar${producto._id}`)
  buttonActualizar.onclick = (e) => {oyenteButtonActualizar(e,producto)}
  buttonEliminar.onclick = (e) => {oyenteButtonEliminar(e,producto)}
}

function oyenteButtonLogout(e){
  clearPage();
  const mensaje = `Hasta luego <b><i>${username}</i></b>!`
  cartelUsuario(mensaje)
  fetch('/logout')
    .then( d => {
        setTimeout(() => {
          document.location.href = "./login"
        }, 2000);
    })
    .catch(e => console.log(e))
}

function oyenteButtonActualizar(e, producto)
{
  let prodActualizado = {
    "nombre": document.getElementById(`card${producto._id}nombre`).innerText,
    "descripcion": document.getElementById(`card${producto._id}descripcion`).innerText,
    "codigo": parseInt(document.getElementById(`card${producto._id}codigo`).innerText),
    "stock": parseInt(document.getElementById(`card${producto._id}stock`).innerText),
    "precio": parseFloat(document.getElementById(`card${producto._id}precio`).innerText),
    "foto": producto.foto
  }
    
  fetch(`/api/productos/${producto._id}`, {
    method:'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prodActualizado)
    })
    .then(data => data.json())
    .then(d => console.log(d))
    .catch(e => console.log(e))
}

function oyenteButtonEliminar(e, producto)
{ 
  fetch(`/api/productos/${producto._id}`, {method:'DELETE'})
    .then(() => document.getElementById(`card${producto._id}`).remove()) //se elimina la card del producto
    .catch(e => console.log(e))
}

function clearPage()
{
  document.getElementById('navbar').remove()
  document.getElementById('btnLogout').remove()
  document.getElementById('textoProducto').remove()
  document.getElementById('divFormProductos').remove()
  document.getElementById('hr').remove()
  document.getElementById('cards').remove()
}

function agregarCard(data){
  let buttonsCard = ``
  if(isAdmin)
  {
    buttonsCard = 
      `
      <div id="botones${data._id}">
        <button id="actualizar${data._id}" class="btn text-white mb-2" style="border-color: #02394A; background-color: #02394A;">Actualizar</button>
        <button id="eliminar${data._id}" class="btn btn-danger mb-2" style="border-color: #664147; background-color: #664147;">Eliminar</button>
      </div>
      `
  }

  document.getElementById("cards").innerHTML += 
    `<div class="col mb-4" id="card${data._id}">
      <div class="card me-auto ms-auto" style="width: 15rem; border-color: #664147; background-color: #EFF6EE;">
        <img src="${data.foto}" class="card-img-top img-fluid" alt="foto">
        <div class="card-body">
          <h5 id="card${data._id}nombre" class="card-title" contenteditable="${isAdmin}">${data.nombre}</h5> 
          <b>$</b><b id="card${data._id}precio" class="card-text" contenteditable="${isAdmin}">${data.precio}</b>
          <p id="card${data._id}descripcion" class="card-text mb-0" contenteditable="${isAdmin}">${data.descripcion}</p>
          <i>Stock:</i><i id="card${data._id}stock" contenteditable="${isAdmin}">${data.stock}</i>
          ${buttonsCard}
          Cód:<span id="card${data._id}codigo" contenteditable="${isAdmin}">${data.codigo}</span> <b>Id:${data._id}</b>
        </div>
      </div>
    </div>
    `
}

function agregarCardsProductos(data){
  if(data.length == 0)
  {
    document.getElementById("cards").innerHTML = 
    `
    <div class="col">
      <h2>No hay productos disponibles</h2>
    </div>
    `
  }
  else
    data.forEach(p => {
      (async function(){
        await agregarCard(p)
        cargarOyenteButtons(p)
      })();
    })
}

function cargarProductos(){

  console.log('desde cargarProductos')
  fetch('/dataProductos', {method:'GET'})
    .then(data => data.json())
    .then(d => {
      isAdmin = d.isAdmin
      username = d.username
      const mensaje = `Bienvenido <b><i>${d.username}</i></b>`
      cartelUsuario(mensaje)
      agregarCardsProductos(d.productos)
    })
    .catch(e => console.log(e))
}

function cartelUsuario(mensaje){
  document.getElementById('cartelUsuario').innerHTML = mensaje 
}

/**************************** Funciones del Carrito ***************************/
function mensajeCarritoVacio()
{
  document.getElementById("contenidoCarrito").innerHTML = `<i>Carrito vacío</i>`
}

function agregarCardAlCarrito(producto)
{
  document.getElementById("contenidoCarrito").innerHTML += 
  `<div class="col mb-4" id="${producto._id}">
    <div class="card me-auto ms-auto" style="width: 15rem; border-color: #664147; background-color: #EFF6EE;">
      <img src="${producto.foto}" class="card-img-top img-fluid" alt="foto">
      <div class="card-body">
        <h5 class="card-title">${producto.nombre}</h5>
        <b class="card-text">$${producto.precio}</b>
        <p class="card-text mb-0">${producto.descripcion}</p>
        <i>Stock:${producto.stock}</i>
        <span>Cód:${producto.codigo}</span>
      </div>
    </div>
  </div>
  `
}

function agregarCardProductosCarrito(productos)
{
  if(productos.length == 0)
    mensajeCarritoVacio()
  else
    productos.forEach(p => agregarCardAlCarrito(p))
}

function cargarCarrito()
{
  fetch('/api/carrito/cargarCarrito', {method:'GET'})
    .then(data => data.json())
    .then(prodsCarrito => agregarCardProductosCarrito(prodsCarrito))
    .catch(e => console.log(e))
}
