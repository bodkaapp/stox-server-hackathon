import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log("Running migrations...");

    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    // マイグレーション用SQLファイルの場所を指定
    const migrationsFolder = process.env.MIGRATIONS_FOLDER || path.resolve(__dirname, "../../");
    console.log(`Using migrations folder: ${migrationsFolder}`);

    try {
        await migrate(db, { migrationsFolder });
        console.log("Migrations completed successfully");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
