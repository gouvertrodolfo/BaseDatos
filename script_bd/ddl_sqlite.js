const { options } = require('../options/sqlite.js')
const knex = require('knex')(options)

knex.schema.hasTable('mensajes').then(function (exists) {
    if (!exists) {
        knex.schema.createTable('mensajes', table => {
            table.increments();
            table.string('correo');
            table.string('texto');
            table.timestamps('fechayhora');
        })
            .then(console.log("tabla mensajes creada"))
            .catch((err) => { console.log(err); throw err })
            .finally(() => { knex.destroy() })
    }
});