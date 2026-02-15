# STOX Server

このリポジトリは、STOX アプリケーションのバックエンドおよび管理画面を構築するためのものです。

## プロジェクト構成

- **`stox-app`**: Hono ベースのバックエンド API サーバー。
- **`admin-app`**: Next.js (App Router) ベースの管理画面アプリケーション。
- **`@drizzle/db`**: Drizzle ORM を使用したデータベーススキーマ定義とマイグレーションロジックを共有するパッケージ。
- **`db`**: ローカル開発用の PostgreSQL データベース (Docker コンテナ)。

## 必須要件

- Docker & Docker Compose
- Node.js (ローカルでのスクリプト実行用, 推奨 v20+)
- pnpm (パッケージマネージャー)

## セットアップ

### 1. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下の環境変数を設定してください。

```env
# Database
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydatabase
DATABASE_URL=postgresql://myuser:mypassword@db:5432/mydatabase?sslmode=disable

# Firebase (admin-app用)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. コンテナの起動

以下のコマンドでアプリケーションとデータベースを起動します。

```sh
docker compose up
```

- **STOX App (API)**: http://localhost:18787
- **Admin App**: http://localhost:18788
- **PostgreSQL**: localhost:5432

## 開発コマンド

### データベースマイグレーション

Drizzle Kit を使用して、スキーマの変更をデータベースに反映します。
`stox-app` コンテナ経由で実行します。

```sh
docker compose run --rm stox-app pnpm --filter @drizzle/db db:push
```

### テスト実行

`stox-app` のテスト (Vitest) を実行します。

```sh
docker compose run --rm stox-app pnpm test
```

## ディレクトリ構造

```
.
├── admin-app/       # Next.js 管理画面
├── stox-app/        # Hono バックエンド API
├── drizzle/         # DBスキーマ共有パッケージ (@drizzle/db)
├── db/              # DB関連ファイル
├── compose.yaml     # Docker Compose 設定
├── package.json     # ルート package.json (Monorepo設定)
└── README.md        # このファイル
```

## 開発環境 (Dev Container)

このプロジェクトは **VS Code Dev Containers** に対応しています。
推奨される開発環境を Docker コンテナとして定義しており、VS Code でプロジェクトを開くだけで、以下のツールがセットアップされた状態で開発を開始できます。

### 含まれるツール

- **Node.js**: v20-bookworm (LTS)
- **Docker**: Docker-in-Docker (dind)
- **Google Cloud SDK**: `gcloud` コマンド
- **Gemini CLI**: `gemini` コマンド (@google/gemini-cli)
- **Lazydocker**: コンテナ管理 TUI (`lazydocker`)
- **Shell**: Zsh (with Oh My Zsh, Powerlevel10k theme)
- **Python**: v3 (gcloud sdk 依存)

### 推奨拡張機能 (VS Code)

Dev Container 起動時に、以下の拡張機能が自動的にインストールされます。

- **ESLint / Prettier**: コード整形・静的解析
- **GitHub Copilot**: AI コーディング支援
- **Docker / Azure Containers**: コンテナ開発支援
- **PostgreSQL**: データベース管理
