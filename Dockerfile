ARG ALPINE_VERSION=3.19

FROM node:20-alpine${ALPINE_VERSION} as builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /build-stage
COPY package*.json ./
RUN npm ci
COPY server.js ./
COPY controllers ./controllers
# RUN npm run build

FROM alpine:${ALPINE_VERSION}
WORKDIR /usr/app

# Add required binaries
RUN apk add --no-cache libstdc++ dumb-init \
  && addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node \
  && chown node:node ./
COPY --from=builder /usr/local/bin/node /usr/local/bin/
COPY --from=builder /usr/local/bin/docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

USER node
# Update the following COPY lines based on your codebase
COPY --from=builder /build-stage/node_modules ./node_modules
COPY --from=builder /build-stage/server.js ./
COPY --from=builder /build-stage/controllers ./controllers
# Run with dumb-init to not start node with PID=1, since Node.js was not designed to run as PID 1
CMD ["dumb-init", "node", "./server.js"]
