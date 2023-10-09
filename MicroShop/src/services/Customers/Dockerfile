FROM node:18.13.0-alpine

ARG PORT

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD ["node", "index.js"]
