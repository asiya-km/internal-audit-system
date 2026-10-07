# ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci --workspaces --include-workspace-root

COPY . .

ARG VITE_API_URL=http://localhost:4000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build -w @iams/shared
RUN npm run build -w @iams/web

# ---- Production stage ----
FROM nginx:alpine AS production

COPY --from=build /app/apps/web/dist /usr/share/nginx/html

COPY docker/web.nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
