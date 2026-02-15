# STOX Admin App

STOX アプリケーションの管理画面です。Next.js (App Router) で構築されています。

基本的にはプロジェクトルートにある `docker compose` コマンドを使用して起動します。

## 技術スタック

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **Backend / Auth**: [Firebase](https://firebase.google.com)

## セットアップ & 起動

### 1. 環境変数の設定

プロジェクトルート (`stox-hono/`) にある `.env` ファイルの設定を使用します。
`admin-app` 固有の設定（Firebaseなど）も `.env` に記述してください。

### 2. アプリケーションの起動

プロジェクトルートで以下のコマンドを実行します。

```bash
docker compose up
```

起動後、ブラウザで [http://localhost:18788](http://localhost:18788) にアクセスしてください。
※ `stox-app` (API) や `db` (PostgreSQL) も同時に起動します。

## ローカル開発 (上級者向け)

`docker compose` を使用せず、`admin-app` ディレクトリ内で直接開発サーバーを起動する場合の手順です。

### 1. 依存関係のインストール

プロジェクトルートで依存関係をインストールします。

```bash
pnpm install
```

### 2. 環境変数の設定

`admin-app` ディレクトリ直下に `.env.local` ファイルを作成し、必要な環境変数を設定してください。

### 3. 開発サーバーの起動

```bash
# admin-app ディレクトリ内で実行
pnpm dev

# またはルートディレクトリからフィルタして実行
pnpm --filter admin-app dev
```

起動ポートはデフォルトで **8080** になります (Docker経由の場合はポートフォワーディングで 18788)。

## ディレクトリ構成

- `app/`: Next.js App Router のページコンポーネント
- `components/`: 再利用可能な UI コンポーネント
- `lib/`: ユーティリティ関数や設定ファイル (Firebase 初期化など)
- `public/`: 静的アセット (画像など)
