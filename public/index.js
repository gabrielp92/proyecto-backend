let isAdmin = null;  
cargarProductos();
cargarCarrito();

function cargarOyenteButtons(producto)
{
  const buttonActualizar = document.getElementById(`actualizar${producto.id}`)
  const buttonEliminar = document.getElementById(`eliminar${producto.id}`)
  buttonActualizar.onclick = (e) => {oyenteButtonActualizar(e,producto)}
  buttonEliminar.onclick = (e) => {oyenteButtonEliminar(e,producto)}
}

function oyenteButtonActualizar(e, producto)
{
  let prodActualizado = {
    "nombre": document.getElementById(`card${producto.id}nombre`).innerText,
    "descripcion": document.getElementById(`card${producto.id}descripcion`).innerText,
    "código": parseInt(document.getElementById(`card${producto.id}código`).innerText),
    "stock": parseInt(document.getElementById(`card${producto.id}stock`).innerText),
    "precio": parseFloat(document.getElementById(`card${producto.id}precio`).innerText),
    "foto": producto.foto
  }
    
  fetch(`/api/productos/${producto.id}`, {
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
  fetch(`/api/productos/${producto.id}`, {method:'DELETE'})
    .then(() => document.getElementById(`card${producto.id}`).remove()) //se elimina la card del producto
    .catch(e => console.log(e))
}

function agregarCard(data){
  let buttonsCard = ``
  if(isAdmin)
  {
    buttonsCard = 
      `
      <div id="botones${data.id}">
        <button id="actualizar${data.id}" class="btn text-white mb-2" style="border-color: #02394A; background-color: #02394A;">Actualizar</button>
        <button id="eliminar${data.id}" class="btn btn-danger mb-2" style="border-color: #664147; background-color: #664147;">Eliminar</button>
      </div>
      `
  }

  document.getElementById("cards").innerHTML += 
    `<div class="col mb-4" id="card${data.id}">
      <div class="card me-auto ms-auto" style="width: 15rem; border-color: #664147; background-color: #EFF6EE;">
        <img src="${data.foto}" class="card-img-top img-fluid" alt="foto">
        <div class="card-body">
          <h5 id="card${data.id}nombre" class="card-title" contenteditable="${isAdmin}">${data.nombre}</h5> 
          <b>$</b><b id="card${data.id}precio" class="card-text" contenteditable="${isAdmin}">${data.precio}</b>
          <p id="card${data.id}descripcion" class="card-text mb-0" contenteditable="${isAdmin}">${data.descripcion}</p>
          <i>Stock:</i><i id="card${data.id}stock" contenteditable="${isAdmin}">${data.stock}</i>
          ${buttonsCard}
          Cód:<span id="card${data.id}código" contenteditable="${isAdmin}">${data.código}</span> <b>Id:${data.id}</b>
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
  fetch('/dataProductos', {method:'GET'})
    .then(data => data.json())
    .then(d => {
      isAdmin = d.isAdmin
      agregarCardsProductos(d.productos)
    })
    .catch(e => console.log(e))
}

/**************************** Funciones del Carrito ***************************/
function mensajeCarritoVacio()
{
  document.getElementById("contenidoCarrito").innerHTML = `<i>Carrito vacío</i>`
}

function agregarCardAlCarrito(producto)
{
  document.getElementById("contenidoCarrito").innerHTML += 
  `<div class="col mb-4" id="${producto.id}">
    <div class="card me-auto ms-auto" style="width: 15rem; border-color: #664147; background-color: #EFF6EE;">
      <img src="${producto.foto}" class="card-img-top img-fluid" alt="foto">
      <div class="card-body">
        <h5 class="card-title">${producto.nombre}</h5>
        <b class="card-text">$${producto.precio}</b>
        <p class="card-text mb-0">${producto.descripcion}</p>
        <i>Stock:${producto.stock}</i>
        <span>Cód:${producto.código}</span>
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
