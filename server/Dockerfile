FROM node:lts-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /app/src

RUN npx prisma generate

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]
