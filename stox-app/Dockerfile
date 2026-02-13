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

# @drizzle/dbとstox-appをビルド
RUN pnpm --filter @drizzle/db build
RUN pnpm --filter stox-app build

# stox-appを本番環境用に分離してデプロイ準備
# --prod で本番用依存関係のみを抽出し、workspaceの依存関係もコピーされます
RUN pnpm --filter stox-app --prod deploy /app/out

# -----------------
# Runner Stage
# -----------------
FROM base AS runner
WORKDIR /app

# ビルド成果物と本番用依存関係をコピー
COPY --from=builder /app/out /app
# ビルド済みの成果物を正しい相対パスに配置するため、stox-app配下のdistを上書きコピー
COPY --from=builder /app/stox-app/dist /app/dist

EXPOSE 8080

# pnpm deploy によって isolated された環境では、/app/package.json が stox-app のものになり、
# 依存関係も /app/node_modules に配置されます。
# 成果物の内部構造（dist/stox-app/src/...）に合わせて実行します。
CMD ["node", "/app/dist/stox-app/src/index.js"]
