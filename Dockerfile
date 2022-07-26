FROM node:16-alpine
WORKDIR /app
COPY package.json .
RUN npm install -g npm@8.10.0
COPY . .

CMD [ "npm","start" ]