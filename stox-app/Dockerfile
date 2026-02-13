FROM node:24 AS base

# -----------------
# Builder Stage
# -----------------
FROM base AS builder
WORKDIR /app

# pnpmワークスペースの設定ファイルをコピー
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 各パッケージのpackage.jsonをコピー
# COPY admin-app/package.json ./admin-app/package.json
COPY drizzle/package.json ./drizzle/package.json
COPY stox-app/package.json ./stox-app/package.json

# pnpmを有効化し、依存関係をインストール
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install

# ソースコードをコピー
COPY drizzle/ ./drizzle/
COPY stox-app/ ./stox-app/

# @drizzle/dbとstox-appをビルド・バンドル
RUN pnpm --filter @drizzle/db build

# esbuild で stox-app と drizzle を1つのファイルにバンドルします
# --external:pg を指定して、接続ライブラリのみ外部（node_modules）に残します
RUN pnpm --filter stox-app exec esbuild src/index.ts --bundle --platform=node --target=node24 --outfile=/app/index.js --external:pg

# -----------------
# Runner Stage
# -----------------
FROM node:24-slim AS runner
WORKDIR /app

# 本番用依存関係のインストール（pg等の外部ライブラリ用）
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/stox-app/package.json ./stox-app/package.json
COPY --from=builder /app/drizzle/package.json ./drizzle/package.json

RUN corepack enable && corepack prepare pnpm@latest --activate
# stox-appが必要とする本番依存関係のみをインストール
RUN pnpm install --prod --filter stox-app

# バンドルされた単一ファイルをコピー
COPY --from=builder /app/index.js ./index.js

EXPOSE 8080

# 単一ファイルを起動
CMD ["node", "index.js"]
