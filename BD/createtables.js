const {options} = require('../options/mariaDB.js')
const knex = require('knex')(options)

knex.schema.createTable('producto',table=>{
    table.increments('id')
    table.string('nombre')
})
.then(console.log("tabla creada"))
.catch((err)=> {console.log(err); throw err})
.finally(()=>{knex.destroy()})