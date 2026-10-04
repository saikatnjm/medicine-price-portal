# syntax=docker/dockerfile:1

# Keep in sync with "engines.node" in package.json and the Vercel project setting.
ARG NODE_VERSION=24

# ---------- base ----------
FROM node:${NODE_VERSION}-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------- deps: install all dependencies (incl. dev) ----------
FROM base AS deps
COPY package.json package-lock.json* ./
# `npm ci` once a lockfile is committed; `npm install` only for the very first bootstrap.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ---------- dev: used by `docker compose up` ----------
FROM base AS dev
# NODE_ENV is deliberately not set: `next dev` uses development and `next build`
# must run with production (a development NODE_ENV breaks prerendering).
# Pre-create mount points owned by the non-root `node` user (uid 1000) so the
# named volumes in docker-compose.yml inherit the right ownership.
RUN mkdir -p /app/node_modules /app/.next && chown -R node:node /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- build: production build ----------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
# Read while statically rendering pages, so it is a build-time setting.
ARG SITE_INDEXABLE=false
ENV SITE_INDEXABLE=${SITE_INDEXABLE}
ENV NODE_ENV=production
RUN npm run build

# ---------- runner: minimal production image ----------
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
