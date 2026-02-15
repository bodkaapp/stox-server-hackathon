# stox-app

STOX アプリケーションのバックエンド API サーバーです。Hono (Node.js) で構築されています。

基本的にはプロジェクトルートにある `docker compose` コマンドを使用して起動します。

## 技術スタック

- **Framework**: [Hono](https://hono.dev) (Node.js Adapter)
- **Language**: TypeScript
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Database**: PostgreSQL
- **Testing**: [Vitest](https://vitest.dev)

## セットアップ & 起動

### 1. 環境変数の設定

プロジェクトルート (`stox-hono/`) にある `.env` ファイルの設定を使用します。
`stox-app` は `DATABASE_URL` などを参照します。

### 2. アプリケーションの起動

プロジェクトルートで以下のコマンドを実行します。

```bash
docker compose up
```

起動後、API サーバーは [http://localhost:18787](http://localhost:18787) でリクエストを受け付けます。
※ `admin-app` (管理画面) や `db` (PostgreSQL) も同時に起動します。

## ローカル開発 (上級者向け)

`docker compose` を使用せず、`stox-app` ディレクトリ内で直接開発サーバーを起動する場合の手順です。

### 1. 依存関係のインストール

プロジェクトルートで依存関係をインストールします。

```bash
pnpm install
```

### 2. 環境変数の設定

`stox-app` ディレクトリ直下に `.env` ファイルを作成し、必要な環境変数を設定してください。
主に `DATABASE_URL` が必要です。

```env
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydatabase?sslmode=disable
```
※ ローカルで起動する場合は、ホストマシンの PostgreSQL に接続するため、ホスト名やポートに注意してください。

### 3. 開発サーバーの起動

```bash
# stox-app ディレクトリ内で実行
pnpm dev

# またはルートディレクトリからフィルタして実行
pnpm --filter stox-app dev
```

起動ポートはデフォルトで **3000** (Honoのデフォルト) または指定されたポートになります。
API エンドポイントの確認には `curl` や Postman などを使用してください。

## 利用可能なスクリプト

`package.json` に定義されている主なコマンドです。

- `pnpm dev`: 開発サーバーを起動します (`tsx watch`).
- `pnpm build`: TypeScript をコンパイルします (`tsc`).
- `pnpm start`: ビルドされたアプリケーションを起動します (`node dist/index.js`).
- `pnpm test`: テストを実行します (`vitest`).

## ディレクトリ構成

- `src/`: ソースコード
  - `index.ts`: エントリーポイント
  - `routes/`: ルーティング定義
  - `db/`: データベース接続設定 (Drizzle)