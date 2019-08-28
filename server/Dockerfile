FROM node:alpine AS build
WORKDIR /opt/app/
COPY ./ ./
RUN yarn install
CMD ["node", "server.js"]
