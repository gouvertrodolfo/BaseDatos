const { options } = require('../options/sqlite.js')

const knex = require('knex')(options)

const moment = require('moment')


class Chat {
    constructor() {
        this.listaMensajes = []
    }

    async init() {
        
        try {
            this.listaMensajes = await knex.select('author','text','fechayhora').from('mensajes').orderBy('fechayhora', 'desc')
        }
        catch (err) { console.log(err) }

        return this.listaMensajes;
    }

    AddMensaje(data) {

        data.fechayhora = moment(new Date()).format('DD/MM/YYYY HH:MM:SS');

        this.listaMensajes.push(data)

        const { author, text, fechayhora } = data
        
        try {
            knex('mensajes').insert({
                author: author,
                text: text,
                fechayhora: fechayhora
            }).then(console.log('insert exitoso'))
        }
        catch (err) { console.log(err) }

        return this.listaMensajes;
    }

}

module.exports = Chat