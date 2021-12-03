const express = require('express')

/**************************************************************************************** */
const { apiProductos } = require("./routes/apiProductos")
const { apiProductosTest } = require("./routes/apiProductosTest")
const { webProductos } = require("./routes/webProductos")
const { webProductosTest } = require("./routes/webProductosTest")
/**************************************************************************************** */
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
/**************************************************************************************** */

const Contenedor = require('./daos/Contenedor')
const inventario = new Contenedor('productos.txt')

/**************************************************************************************** */
const Chat = require('./daos/ContenedorMensajes')

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
app.use('/api/productosTest', apiProductosTest)
app.use('/', webProductos)
app.use('/test', webProductosTest)
/**************************************************************************************** */

const normalizer = require("normalizr")
// const normalize = normalizer.normalize;
const schema = normalizer.schema;

// Definimos un esquema author
const author_schema = new schema.Entity('author',{},{idAttribute:'correo'});

// Definimos un esquema de mensaje
const mensajes_schema = new schema.Entity('mensajes', {
  commenter: author_schema
});


/**************************************************************************************** */

io.on('connection', async socket => {

    console.log('Nuevo cliente conectado!')

    let mensajes = await chat.getAll();    

    console.log(mensajes)    
    const mensajes_normal = normalizer.normalize(mensajes, mensajes_schema)
    console.log(mensajes_normal)    

    /* Envio los mensajes al cliente que se conectó */
    socket.emit('mensajes', mensajes_normal)

    let productos = await inventario.init();
    socket.emit('productos', productos)

    /* Escucho los mensajes enviado por el cliente y se los propago a todos */
    socket.on('nuevoMensaje', async data => {
        
        mensajes = await chat.AddMensaje(data)
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
