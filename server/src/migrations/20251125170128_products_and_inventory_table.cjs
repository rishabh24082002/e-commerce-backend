exports.up = function(knex) {
return knex.schema
.createTable('products', function(table) {
table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
table.string('sku').unique().notNullable();
table.string('name').notNullable();
table.text('description');
table.decimal('price', 12, 2).notNullable();
table.jsonb('metadata');
table.timestamp('created_at').defaultTo(knex.fn.now());
table.timestamp('updated_at').defaultTo(knex.fn.now());
})
.createTable('inventory', function(table) {
table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
table.uuid('product_id').notNullable().references('id').inTable('products').onDelete('CASCADE');
table.integer('stock').notNullable().defaultTo(0);
table.integer('reserved').notNullable().defaultTo(0);
table.integer('version').notNullable().defaultTo(0);
table.timestamp('updated_at').defaultTo(knex.fn.now());
});
};


exports.down = function(knex) {
return knex.schema
.dropTableIfExists('inventory')
.dropTableIfExists('products');
};