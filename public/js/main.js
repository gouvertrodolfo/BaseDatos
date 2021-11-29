const socket = io.connect();

function addMessage(e) {
    const mensaje = {
        author: { 
            correo: document.getElementById('correo').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
        },
        text: document.getElementById('texto').value
    };
    document.getElementById('texto').value = ''
    socket.emit('nuevoMensaje', mensaje);
    return false;
}

function addProducto(prd) {
    const nuevoPrd = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    }
    socket.emit('nuevoProducto', nuevoPrd)
    return false;
}

socket.on('mensajes', async msjs => {
    const plantilla = await buscarPlantillaMensajes()
    const html = armarHTML(plantilla, msjs)
    document.getElementById('messages').innerHTML = html;
});

socket.on('productos', async arrayProductos => {
    const plantilla = await buscarPlantillaProductos()
    const html = armarHTML(plantilla, arrayProductos)
    document.getElementById('grillaProductos').innerHTML = html

})

function buscarPlantillaProductos() {
    return fetch('/plantillas/ListadoProductos.ejs')
        .then(respuesta => respuesta.text())
}

function buscarPlantillaMensajes() {
    return fetch('/plantillas/mensaje.ejs')
        .then(respuesta => respuesta.text())
}

function armarHTML(plantilla, data) {
    const render = ejs.compile(plantilla);
    const html = render({ data })
    return html
}

async function cargarProductosFake() {

    const [plantilla, arrayProductos] = await Promise.all([buscarPlantillaProductos(), buscarProductosFake()])

    const html = armarHTML(plantilla, arrayProductos)
    document.getElementById('grillaProductos').innerHTML = html

}

function buscarProductosFake() {
    return fetch('/api/productosTest/')
        .then(response => response.json())
}
