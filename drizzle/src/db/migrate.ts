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

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    // デバッグ用：接続文字列の構成を表示（パスワードは隠す）
    try {
        const parsedUrl = new URL(connectionString);
        console.log(`Connecting to: ${parsedUrl.protocol}//${parsedUrl.username}:****@${parsedUrl.host}${parsedUrl.pathname}${parsedUrl.search}`);
    } catch (e) {
        console.log("Connecting with a non-URL format connection string");
    }

    const poolConfig: pg.PoolConfig = {
        connectionString,
    };

    // Cloud SQL (Unix Socket) 対応の明示化
    if (connectionString.includes("/cloudsql/")) {
        try {
            const url = new URL(connectionString);
            const hostParam = url.searchParams.get("host");
            if (hostParam && hostParam.startsWith("/cloudsql/")) {
                console.log(`Using Unix socket: ${hostParam}`);
                poolConfig.host = hostParam;
            }
        } catch (e) { }
    }

    const pool = new pg.Pool(poolConfig);
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
