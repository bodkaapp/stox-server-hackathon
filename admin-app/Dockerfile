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

# Copy specific files and directories
COPY admin-app/app ./app
COPY admin-app/public ./public
COPY admin-app/next.config.ts ./next.config.ts
COPY admin-app/postcss.config.mjs ./postcss.config.mjs
COPY admin-app/eslint.config.mjs ./eslint.config.mjs
COPY admin-app/tsconfig.json ./tsconfig.json
COPY drizzle ./drizzle

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
