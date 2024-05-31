FROM node:20.9.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

WORKDIR /app/src

RUN npx prisma migrate deploy
RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "start"]
