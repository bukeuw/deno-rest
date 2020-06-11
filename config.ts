export const database = {
  user: Deno.env.get("DB_USER") || "root",
  password: Deno.env.get("DB_PASSWORD") || "secret",
  database: Deno.env.get("DB_USER") || "root",
  hostname: Deno.env.get("DB_HOST") || "root",
  port: 5432
}
