const express = require('express')
const moment = require('moment')
/**************************************************************************************** */
const { apiProductos } = require("./routes/apiProductos")
const { webProductos } = require("./routes/webProductos")
/**************************************************************************************** */
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
/**************************************************************************************** */

const Contenedor = require('./Contenedor')
const inventario = new Contenedor('productos.txt')



const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const mensajes = []
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

    /* Envio los mensajes al cliente que se conectó */
    socket.emit('mensajes', mensajes)

    const array = await inventario.getAll();
    socket.emit('productos', array)

    /* Escucho los mensajes enviado por el cliente y se los propago a todos */
    socket.on('nuevoMensaje', data => {
        data.fechayhora = moment(new Date()).format('DD/MM/YYYY HH:MM:SS');
        mensajes.push(data)
        io.sockets.emit('mensajes', mensajes)
    })

    /* Escucho los nuevos productos enviado por el cliente y se los propago a todos */
    socket.on('nuevoProducto', async prd => {

        await inventario.save(prd)
        const array = await inventario.getAll();
        io.sockets.emit('productos', array)

    })

})

/**************************************************************************************** */
const PORT = 8080
const connectedServer = httpServer.listen(PORT, function () {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
