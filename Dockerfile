FROM node:21-alpine

RUN mkdir -p /usr/app
RUN mkdir -p /usr/app/controllers

COPY package*.json /usr/app/
COPY server.js /usr/app/
COPY controllers/* /usr/app/controllers

WORKDIR /usr/app

RUN npm install
CMD ["node", "server.js"]