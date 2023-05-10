FROM node:18-alpine

WORKDIR /app

COPY .env-production .
COPY . .

ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN npm ci
RUN npm run build:css
RUN npm run build:js
RUN npm run build

EXPOSE 3000

CMD ["node", "./dist/main.js"]
