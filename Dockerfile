ARG ALPINE_VERSION=3.19
# build and install part
FROM node:20-alpine${ALPINE_VERSION}

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN mkdir -p /usr/app/my-face-recognition-api
WORKDIR /usr/app/my-face-recognition-api
COPY package*.json ./
COPY server.js ./
COPY controllers ./controllers
RUN npm ci
