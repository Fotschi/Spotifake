FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Ensure the uploads directory exists
RUN mkdir -p uploads

EXPOSE 3000

CMD ["node", "server.js"]
