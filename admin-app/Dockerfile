# Stage 1: Builder
FROM node:24 AS base

FROM base AS deps

WORKDIR /app

COPY admin-app/package*.json ./
RUN npm install
# COPY package.json package-lock.json ./
# RUN npm ci

FROM deps AS builder
COPY --from=deps /app/node_modules ./node_modules

COPY admin-app .

RUN npm run build

FROM base AS runner

WORKDIR /app

# Copy necessary files from the builder stage for standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

# The next.config.ts is often not needed at runtime for standalone builds,
# but keeping it for now if there are any runtime-specific configurations.
# COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

ENV NODE_ENV=production
USER node

CMD ["node", "server.js"]
