# ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci --workspaces --include-workspace-root

COPY . .

RUN npx prisma generate --schema=apps/api/prisma/schema.prisma
RUN npm run build -w @iams/shared
RUN npm run build -w @iams/api

# ---- Production stage ----
FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci --omit=dev --workspaces --include-workspace-root

COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/api/src/generated ./apps/api/src/generated

USER nodejs

EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
