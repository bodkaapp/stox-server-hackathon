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

# -----------------
# Runner Stage
# -----------------
FROM base AS runner
WORKDIR /app

# 本番用依存関係のインストール準備
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/stox-app/package.json ./stox-app/package.json
COPY --from=builder /app/drizzle/package.json ./drizzle/package.json

# 本番用依存関係のみをインストール（workspaceのリンクが作成されます）
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod

# 各パッケージのビルド成果物をコピー
# これにより symlink 経由で drizzle の成果物が正しく参照されます
COPY --from=builder /app/stox-app/dist ./stox-app/dist
COPY --from=builder /app/drizzle/dist ./drizzle/dist

EXPOSE 8080

# 実行（tsconfigの修正によりフラットな dist/index.js になっています）
CMD ["node", "stox-app/dist/index.js"]
