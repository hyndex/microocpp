FROM node:16
WORKDIR /home/app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 6000
CMD [ "npm", "run", "start:local" ]