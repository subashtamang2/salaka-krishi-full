# Base stage for dependencies
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# Build stage
FROM base AS build
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN npx prisma generate
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./

# Install only production dependencies if needed,
# but NestJS build usually bundles what's needed or expects node_modules.
# For simplicity and Prisma, we keep the node_modules from build or re-install prod.
# Given Prisma client needs to be consistent, keeping build node_modules is safer.

EXPOSE 8000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
