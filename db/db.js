const knex = require('../knexfile')
const db = require('knex')(knex[process.env.NODE_ENV])

module.exports = db
