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

# esbuild で依存関係（pg, drizzle-orm等）を含めてすべてをバンドルします。
# --format=esm を指定し、stox-app/index.js に出力します。
# pg-native は存在しないため --external で除外します。
RUN pnpm --filter stox-app exec esbuild src/index.ts --bundle --platform=node --target=node24 --format=esm --outfile=stox-app/index.js --external:pg-native

# -----------------
# Runner Stage
# -----------------
FROM node:24-slim AS runner
WORKDIR /app

# 本番実行用の設定ファイルをコピー（ESM認識のため stox-app/package.json が必要）
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/stox-app/package.json ./stox-app/package.json

# すべてがバンドルされているため、個別のライブラリインストールは不要ですが、
# ランタイムの整合性のために最小限の設定を維持します。
RUN corepack enable && corepack prepare pnpm@latest --activate
# インストールなしでも動作するはずですが、依存解決の念のため --prod でリンクのみ構成
RUN pnpm install --prod --filter stox-app

# バンドルされたファイルを正しいディレクトリにコピー
COPY --from=builder /app/stox-app/index.js ./stox-app/index.js

EXPOSE 8080

# 正しいディレクトリから起動
CMD ["node", "stox-app/index.js"]
