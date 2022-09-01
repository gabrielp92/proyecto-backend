const socket = io()
loadFirstDataChat()
const btnSend = document.getElementById('send')
btnSend.onclick = e => {

  let form = document.querySelector('.needs-validation')
  let hayMail = true
  if (!form.checkValidity()) {
    hayMail = false
    e.preventDefault()
    e.stopPropagation()
    form.classList.add('was-validated')
  }
  if(hayMail == true)
  { 
    let username = document.getElementById('username').value
    let msn = document.getElementById('msn').value
    socket.emit('chat-in', {msn, username})
  }
}

socket.on('chat-out', data => {
  addDataChatToDiv(data)
})

socket.on('producto-out', producto => {
  console.log('entre')

  let filaTabla = `
    <tr class="border border-secondary">
      <td class="p-4">${producto.title}</td>
      <td class="p-4">${producto.price}</td>
      <td class="p-4">
        <img src="${producto.thumbnail}" alt="foto">
      </td>
    </tr>`
   document.getElementById("body-tabla").innerHTML += filaTabla
})

function addDataChatToDiv(data){
  document.getElementById("chat").innerHTML += `<br><b style="color:blue">${data.username}</b> <span style="color:brown">[${data.date} ${data.time}]</span><span style="color:green">: <i>${data.msn}</i></span>`
}

function loadDataChatToDiv(data){
  data.forEach(d => addDataChatToDiv(d.data))
}

function loadFirstDataChat(){

  fetch('/dataChat')
    .then(data => data.json())
    .then(d => loadDataChatToDiv(d.data))
    .catch(e => alert(e))
}