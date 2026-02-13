FROM node:24 AS base

# -----------------
# Builder Stage
# -----------------
FROM base AS builder
WORKDIR /app

# pnpmワークスペースの設定ファイルをコピー
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 各パッケージのpackage.jsonをコピー
COPY drizzle/package.json ./drizzle/package.json
COPY stox-app/package.json ./stox-app/package.json

# pnpmを有効化し、依存関係をインストール
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# ソースコードをコピー
COPY drizzle/ ./drizzle/
COPY stox-app/ ./stox-app/

# stox-appのみをビルド
RUN pnpm --filter stox-app build

# -----------------
# Runner Stage
# -----------------
FROM base AS runner
WORKDIR /app

# 必要な設定ファイルと本番用依存関係をコピー
# `COPY --from=builder` を使って、builder環境からファイルを持ってくる
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/drizzle/package.json ./drizzle/package.json
COPY --from=builder /app/stox-app/package.json ./stox-app/package.json

# 本番依存関係のみをインストール
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --prod --frozen-lockfile

# ビルド成果物をコピー
COPY --from=builder /app/stox-app/dist ./dist

EXPOSE 8080

CMD ["node", "./dist/index.js"]
