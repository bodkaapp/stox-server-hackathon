# STOX server

## DB migration

```sh
docker compose run --rm stox-app pnpm --filter @drizzle/db db:push
```

## test

```sh
docker compose run --rm stox-app pnpm test
```
