import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

// バンドル（CJS）環境と開発（ESM）環境の両方に対応したパス解決
const getDirname = () => {
    try {
        // @ts-ignore
        if (typeof __dirname !== "undefined") return __dirname;
    } catch (e) { }
    return path.dirname(fileURLToPath(import.meta.url));
};

const _dirname = getDirname();

async function main() {
    console.log("Running migrations...");

    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    // マイグレーション用SQLファイルの場所を指定
    // バンドル後は migrate.cjs と同じ階層の drizzle フォルダ、
    // 開発時は drizzle/src/db から見た ../../ を参照
    const migrationsFolder = process.env.MIGRATIONS_FOLDER ||
        (process.env.NODE_ENV === "production"
            ? path.resolve(_dirname, "drizzle")
            : path.resolve(_dirname, "../../"));
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
