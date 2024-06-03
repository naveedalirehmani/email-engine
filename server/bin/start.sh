#!/bin/sh

npx prisma generate

npm run build

npx prisma migrate deploy

npm run start
