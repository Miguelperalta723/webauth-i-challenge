
exports.up = function(knex) {
  return knex.schema
  .createTable('users', tbl => {
      tbl.increments()
      tbl.string('username', 280).unique().notNullable()
      tbl.string('password', 280).notNullable()
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('users')
};
