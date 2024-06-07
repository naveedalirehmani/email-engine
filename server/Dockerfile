FROM node:lts-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /app/src

EXPOSE 4000

CMD ["../bin/start.sh"]
