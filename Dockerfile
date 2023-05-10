FROM node:18-slim

WORKDIR /app

COPY src ./src
COPY static ./static
COPY styles ./styles
COPY views ./views
COPY .env-production .
COPY package-lock.json .
COPY package.json .
COPY tsconfig.json .

ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN npm ci
RUN npm run css
RUN npm run build

EXPOSE 3000

CMD ["node", "./dist/main.js"]
