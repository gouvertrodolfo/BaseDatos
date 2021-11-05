const options = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./BD/eCommmerce.sqlite"
    }
  });

module.exports={options}