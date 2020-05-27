FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

RUN npm run build

FROM nginx

COPY ./nginx/default.conf /etc/nginx/conf.d/
COPY --from=0 /app/build /usr/share/nginx/html