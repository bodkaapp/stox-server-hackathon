import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
// @ts-ignore
import * as schema from "./schema";
import "dotenv/config";

if (!process.env.DB_HOST) {
  throw new Error("DB_HOST environment variable is not set");
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const db = drizzle(pool, { schema });
