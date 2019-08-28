FROM node:alpine AS build
WORKDIR /opt/app/
COPY package.json yarn.lock webpack.config.js ./
COPY src/ src/
COPY static/ static/
COPY crud/ crud/
RUN yarn install
WORKDIR /opt/app/crud/
RUN yarn install
WORKDIR /opt/app/
RUN yarn build

FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/
COPY --from=build /opt/app/dist/ /app/static/
EXPOSE 80
