exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
    })
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable('users')
  ])
}
