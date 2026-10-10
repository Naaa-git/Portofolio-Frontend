# Multi-stage build: node_modules and the Nuxt/Vite build toolchain only
# exist in the build stage; the final image just runs the compiled Nitro
# server output, so it doesn't carry any of that weight into deployment.

FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# nuxt.config.ts reads this directly via process.env at the TOP LEVEL of the
# file — that code runs once, during `pnpm build` below, not at container
# startup. Unlike runtimeConfig.public values (read fresh via
# useRuntimeConfig() at request time), this gets baked into the compiled
# output permanently — frontend.env on the VPS is too late for this one,
# it has to arrive as a build-time ARG instead.
ARG NUXT_PUBLIC_SITE_URL
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL

# Copy lockfile + manifest first so `pnpm install` is cached by Docker and
# skipped on rebuilds where only application source changed, not dependencies.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22-alpine AS final
WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
EXPOSE 3000

# Nuxt's default "node-server" Nitro preset bundles its own minimal server —
# the whole app runs from this one output folder, no node_modules needed here.
COPY --from=build /app/.output ./.output

CMD ["node", ".output/server/index.mjs"]
