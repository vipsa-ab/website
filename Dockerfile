FROM node:25-alpine3.23 AS base
WORKDIR /app

# By copying only the package.json and package-lock.json here, we ensure that the following `-deps` steps are independent of the source code.
# Therefore, the `-deps` steps will be skipped if only the source code changes.
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm

FROM base AS prod-deps
RUN pnpm install --prod --ignore-scripts

FROM base AS build-deps
RUN pnpm install --ignore-scripts

FROM build-deps AS build
COPY . .
RUN pnpm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]