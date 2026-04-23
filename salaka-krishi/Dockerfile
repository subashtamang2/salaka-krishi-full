# Build stage
FROM node:20-alpine  AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

# Build args for frontend environment variables
ARG VITE_BACKEND_ENDPOINT
ARG VITE_IMAGE_BASE_URL
ENV VITE_BACKEND_ENDPOINT=$VITE_BACKEND_ENDPOINT
ENV VITE_IMAGE_BASE_URL=$VITE_IMAGE_BASE_URL

RUN pnpm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
