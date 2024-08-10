FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# ENV DB_URI=mongodb+srv://SbhxKp6yVUfgoMEA:SbhxKp6yVUfgoMEA@cluster0.q65hmdh.mongodb.net/test-youapp?retryWrites=true&w=majority
# ENV JWT_SECRET=n3st4pp
# ENV JWT_EXPIRES=1h
# ENV MESSAGE_QUEUE_URL=amqp://rabbitmq:5672

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
