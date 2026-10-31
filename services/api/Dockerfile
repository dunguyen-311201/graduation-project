# Build from the repo root: docker build -f services/api/Dockerfile -t sos-api .
FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

# Keep only @sos/api and the workspace packages it depends on.
FROM base AS prune
COPY . .
RUN pnpm dlx turbo@2.11.10 prune @sos/api --docker

FROM base AS build
COPY --from=prune /repo/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=prune /repo/out/full/ .
RUN pnpm turbo run build --filter=@sos/api \
  && pnpm deploy --filter=@sos/api --prod --legacy /prod/api

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /prod/api ./
USER node
EXPOSE 4000
CMD ["node", "dist/main.js"]
