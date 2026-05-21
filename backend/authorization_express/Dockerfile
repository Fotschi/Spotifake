FROM node:alpine3.23

COPY . .

RUN ["npm", "install"]

EXPOSE 3000

CMD ["node", "server.js"]

# docker build -t auth_express_js:latest .
# docker build -t auth_express_js:1.0.0 .