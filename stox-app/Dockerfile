FROM node:24 AS base

# -----------------
# Builder Stage
# -----------------
FROM base AS builder
WORKDIR /app

# pnpmワークスペースの設定ファイルをコピー
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 各パッケージのpackage.jsonをコピー（ワークスペースの整合性のためにすべて必要）
COPY admin-app/package.json ./admin-app/package.json
COPY drizzle/package.json ./drizzle/package.json
COPY stox-app/package.json ./stox-app/package.json

# pnpmを有効化し、依存関係を一度インストール（キャッシュ用）
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install

# ソースコードをコピー
COPY drizzle/ ./drizzle/
COPY stox-app/ ./stox-app/

# ワークスペース全体の整合性を確保するため、ソースコピー後に再度リンクを確認
RUN pnpm install

# @drizzle/dbとstox-appをビルド・バンドル
RUN pnpm --filter @drizzle/db build

# esbuild で依存関係（pg, drizzle-orm等）を含めてすべてをバンドルします。
# ESM での Dynamic require エラーを避けるため、CommonJS (cjs) 形式で出力します。
# 拡張子を .cjs にすることで package.json の type: module 設定をバイパスします。
RUN pnpm --filter stox-app exec esbuild src/index.ts \
    --bundle \
    --platform=node \
    --target=node24 \
    --format=cjs \
    --outfile=/app/index.cjs \
    --external:pg-native

# マイグレーションスクリプトもバンドル
RUN pnpm --filter stox-app exec esbuild ../drizzle/src/db/migrate.ts \
    --bundle \
    --platform=node \
    --target=node24 \
    --format=cjs \
    --outfile=/app/migrate.cjs \
    --external:pg-native

# -----------------
# Runner Stage
# -----------------
FROM node:24-slim AS runner
WORKDIR /app

# すべての依存関係がバンドルされた単一ファイルをコピー
COPY --from=builder /app/index.cjs ./index.cjs
COPY --from=builder /app/migrate.cjs ./migrate.cjs

# マイグレーション用の管理ファイル（SQLやmetaフォルダ）をすべてコピー
COPY --from=builder /app/drizzle/ ./drizzle/

# 本番環境では個別のライブラリインストールもソースフォルダも不要です。
# (index.cjs がすべてのロジックを保持しているため)

EXPOSE 8080

# バンドルされた単一ファイルを起動
CMD ["node", "index.cjs"]
