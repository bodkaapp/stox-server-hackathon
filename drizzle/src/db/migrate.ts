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

    // デバッグ用：接続文字列の一部を表示（パスワードは隠す）
    const maskedConn = connectionString.replace(/:([^@]+)@/, ":****@");
    console.log(`Connecting with: ${maskedConn}`);

    const poolConfig: pg.PoolConfig = {
        connectionString,
    };

    // Cloud SQL (Unix Socket) 対応の明示化
    // new URL() は @/ という形式（ホスト空）をパースできない場合があるため、
    // ダミーのホストを補完してパースを試みる
    try {
        const urlToParse = connectionString.includes("@/")
            ? connectionString.replace("@/", "@localhost/")
            : connectionString;
        const url = new URL(urlToParse);
        const hostParam = url.searchParams.get("host");

        if (hostParam && hostParam.startsWith("/cloudsql/")) {
            console.log(`Detected Unix socket in query param: ${hostParam}`);
            poolConfig.host = hostParam;
        } else if (connectionString.includes("/cloudsql/")) {
            // クエリパラメータにないが文字列に含まれる場合の予備的な抽出
            const match = connectionString.match(/host=([^&]+)/);
            if (match && match[1].startsWith("/cloudsql/")) {
                console.log(`Extracted Unix socket from string: ${match[1]}`);
                poolConfig.host = match[1];
            }
        }
    } catch (e) {
        console.log("Failed to parse connection string for socket path enhancement, using raw string");
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
