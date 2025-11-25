exports.up = function (knex) {
  return knex.schema
    .createTable("orders", function (table) {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");
      table.decimal("total", 14, 2).notNullable().defaultTo(0);
      table.string("status").notNullable().defaultTo("pending");
      table.jsonb("meta");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("order_items", function (table) {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table
        .uuid("order_id")
        .notNullable()
        .references("id")
        .inTable("orders")
        .onDelete("CASCADE");
      table
        .uuid("product_id")
        .notNullable()
        .references("id")
        .inTable("products");
      table.integer("quantity").notNullable();
      table.decimal("unit_price", 12, 2).notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("order_items")
    .dropTableIfExists("orders");
};
