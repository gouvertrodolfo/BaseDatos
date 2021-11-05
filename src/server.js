const express = require('express')

/**************************************************************************************** */
const { apiProductos } = require("./routes/apiProductos")
const { webProductos } = require("./routes/webProductos")
/**************************************************************************************** */
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
/**************************************************************************************** */
const Contenedor = require('./Contenedor')
const inventario = new Contenedor('productos.txt')
/**************************************************************************************** */
const Chat = require('./Chat')
const chat = new Chat();

/**************************************************************************************** */

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.static('public'))

//Configuracion del motor de vistas que se usara
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//espacio de rutas
app.use('/api/productos', apiProductos)
app.use('/', webProductos)

/**************************************************************************************** */

/**************************************************************************************** */

io.on('connection', async socket => {

    console.log('Nuevo cliente conectado!')

    let mensajes = await chat.init();    
    /* Envio los mensajes al cliente que se conectó */
    socket.emit('mensajes', mensajes)

    let productos = await inventario.init();
    socket.emit('productos', productos)

    /* Escucho los mensajes enviado por el cliente y se los propago a todos */
    socket.on('nuevoMensaje', data => {
        
        mensajes = chat.AddMensaje(data)
        io.sockets.emit('mensajes',  mensajes)
    })

    /* Escucho los nuevos productos enviado por el cliente y se los propago a todos */
    socket.on('nuevoProducto', async prd => {

        await inventario.save(prd)
        productos = inventario.getAll();
        io.sockets.emit('productos', productos)

    })

})

/**************************************************************************************** */
const PORT = 8080
const connectedServer = httpServer.listen(PORT, function () {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
