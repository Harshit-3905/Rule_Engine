FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci
RUN npm install -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "cd dist && serve"]
