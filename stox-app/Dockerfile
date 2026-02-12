FROM node:24 AS base

FROM base AS builder

WORKDIR /app
COPY stox-app/package.json ./package.json
COPY stox-app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY drizzle ./drizzle
COPY stox-app/tsconfig.json ./tsconfig.json
COPY stox-app/src ./src

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile
RUN ls -l node_modules
RUN ls -l node_modules/drizzle-orm

# COPY . .
RUN pnpm run build

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 8080

CMD ["node", "dist/index.js"]
