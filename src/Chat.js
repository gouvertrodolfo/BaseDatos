const { options } = require('../options/sqlite.js')
const knex = require('knex')(options)

class Chat{
    constructor(){
        listaMensajes=[]
    }

    init() {
        knex.select('correo', 'texto', 'year').from('mensajes')
    }

    AddMensaje(data){
        data.fechayhora = moment(new Date()).format('DD/MM/YYYY HH:MM:SS');
        knex('mensajes').insert()
    }

}

module.exports= Chat