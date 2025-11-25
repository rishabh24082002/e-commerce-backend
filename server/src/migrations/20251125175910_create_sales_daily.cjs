exports.up = function (knex) {
  return knex.schema.createTable("sales_daily", function (table) {
    table.date("date").primary();
    table.decimal("total_revenue", 14, 2).defaultTo(0);
    table.integer("total_orders").defaultTo(0);
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("sales_daily");
};
