exports.up = function(knex) {
return knex.schema
.createTable('users', function(table) {
table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
table.string('email').notNullable().unique();
table.string('password_hash').notNullable();
table.string('name');
table.string('role').notNullable().defaultTo('customer'); 
table.timestamp('created_at').defaultTo(knex.fn.now());
});
};


exports.down = function(knex) {
return knex.schema.dropTableIfExists('users');
};
