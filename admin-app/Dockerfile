# -----------------
# Builder Stage
# -----------------
FROM node:24 AS builder
WORKDIR /app

# pnpmを有効化
RUN corepack enable

# pnpmワークスペースの設定ファイルをコピー
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 各パッケージのpackage.jsonをコピー（ワークスペースの整合性のためにすべて必要）
COPY admin-app/package.json ./admin-app/package.json
COPY drizzle/package.json ./drizzle/package.json
COPY stox-app/package.json ./stox-app/package.json

# 依存関係をインストール
RUN pnpm install

# ソースコードをコピー
COPY admin-app/ ./admin-app/
COPY drizzle/ ./drizzle/

# Add ARG and ENV for Firebase variables
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID

# drizzleとadmin-appをビルド
RUN pnpm --filter drizzle build
RUN pnpm --filter admin-app build

# -----------------
# Runner Stage
# -----------------
FROM node:24 AS runner
WORKDIR /app

ENV NODE_ENV=production

# standaloneビルドから必要なファイルをコピー
# モノレポの場合、standalone の中身はディレクトリ構造を反映しています
COPY --from=builder /app/admin-app/.next/standalone ./
COPY --from=builder /app/admin-app/public ./admin-app/public
COPY --from=builder /app/admin-app/.next/static ./admin-app/.next/static

# Cloud Run は 8080 ポートを期待します
ENV PORT=8080
EXPOSE 8080

# standaloneモードでは、server.js はサブディレクトリ内に配置されます
CMD ["node", "admin-app/server.js"]
