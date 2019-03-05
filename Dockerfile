FROM node:10.5.0
EXPOSE 8080
COPY . .
CMD npm install
CMD npm start