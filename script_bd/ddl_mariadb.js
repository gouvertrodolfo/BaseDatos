const {options} = require('../options/mariaDB.js')
const knex = require('knex')(options)


knex.schema.hasTable('mensajes').then(function (exists) {
    
    if (!exists) {
        
        knex.schema.createTable('productos',table=>{
            table.increments()
            table.string('nombre')
        })
        .then(console.log("tabla creada"))
        .catch((err)=> {console.log(err); throw err})
        .finally(()=>{knex.destroy()})

    }
    
});

