FROM node:18-alpine

RUN mkdir -p /app

WORKDIR /app

RUN cd /app

RUN apk add --update npm

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm", "start" ]