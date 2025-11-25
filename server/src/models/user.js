import db from "../db.js";

export const createUser = async (attrs) => {
  const [user] = await db("users")
    .insert({
      email: attrs.email,
      password_hash: attrs.password_hash,
      name: attrs.name || null,
      role: attrs.role || "customer",
    })
    .returning("*");
  return user;
};

export const findUserByEmail = async (email) => {
  const user = await db("users").where({ email }).first();
  return user;
};

export const findUserById = async (id) => {
  const user = await db("users").where({ id }).first();
  return user;
};
