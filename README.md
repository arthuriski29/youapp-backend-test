<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Backend Test YouApp

A Backend Test Project for Backend Candidate in YouApp

## What is this ?

This is a NestJS-based application with MongoDB for data storage and RabbitMQ for message queuing.


## Tech Stack

| Stack | Logo     | Description |
| :-------- | :------- | :------- |
| [NestJS](https://nestjs.com/)  | <img src="https://nestjs.com/img/logo-small.svg" alt="Nest Image" width="200" style="margin-right: 20px;"> |Framework for Backend App|
| [MongoDB](https://www.mongodb.com/)  |  <img src="https://webimages.mongodb.com/_com_assets/cms/kuyjf3vea2hg34taa-horizontal_default_slate_blue.svg?auto=format%252Ccompress" alt="Mongo Image" width="600">|mongoose NOSQL with MongoDB Atlas Database|
| [RabbitMQ](https://www.rabbitmq.com/) | <img src="https://www.rabbitmq.com/img/rabbitmq-logo-with-name.svg" alt="RabbitMQ Image" width="600"> | message-broker for chat feature






# How to run this app ?

## 1. Run Locally
### Pull rabbitmq diocker image

Pull [rabbitmq's official docker image](https://hub.docker.com/_/rabbitmq) from docker hub to your image

or on terminal
```bash
docker pull rabbitmq:3-management
```

run the image
```bash
docker run --name rabbitmq -d -p 15672:15672 rabbitmq:3-management
```
visit [http://localhost:5672/](http://localhost:5672/) on your browser to make sure rabbitmq management can be accessed

Then,

### Clone and run

Clone this project
```bash
  git clone https://github.com/arthuriski29/youapp-backend-test/
```
Go to the project directory

```bash
  cd test-youapp
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start:dev
```
## 2. Using Docker


### 1. Create `docker.compose.yml`
Create this file on your desired directory folder

```bash
# docker.compose.yml
version: '3.8'

services:
  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    ports:
      - "5672:5672"  # AMQP protocol port
      - "15672:15672"  # Management UI
    volumes:
      - /var/lib/rabbitmq
    networks:
      - app-network

  app:
    image: arthuriski/youapp-backend-test-app:latest
    container_name: my-nestapp-backend
    depends_on:
      - rabbitmq
    ports:
      - "3000:3000"
    environment:
      - DB_URI=mongodb+srv://SbhxKp6yVUfgoMEA:SbhxKp6yVUfgoMEA@cluster0.q65hmdh.mongodb.net/test-youapp?retryWrites=true&w=majority
      - MESSAGE_QUEUE_URL=amqp://rabbitmq:5672
      - JWT_SECRET=n3st4pp
      - JWT_EXPIRES=1h
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### 2. Run docker compose
Last step is run the `docker.compose.yml` file by:
```bash
docker-compose up
```

#### What this command do ?

1 This command will automatically pull all necessary images that described on docker compose above if it's not already present:
- arthuriski/youapp-backend-test-app:latest [from here](https://hub.docker.com/r/arthuriski/youapp-backend-test-app)

```bash
docker pull arthuriski/youapp-backend-test-app
```
- rabbitmq:3-management [from here](https://hub.docker.com/layers/library/rabbitmq/3-management/images/sha256-fa9e956f0d74794b2fcadd818ef90aa7b91a9807a6628af27ac6b5936ebad417?context=explore)
```bash
docker pull rabbitmq:3-management
```


2 Then will start both the app and RabbitMQ services.

#### Check logs / terminal
once you get this on your terminal

<img src="public/assets/backend-app-start-working.jpg" >

congrats nesjs successfully started

## Try host server !

visit [http://localhost:5672/](http://localhost:5672/) on your browser to make sure rabbitmq management can be accessed

visit [http://localhost:3000/](http://localhost:3000/) on your browser to see the app is running

if its connected you will see
```bash
{
    "success": true,
    "message": "test-youapp Backend Connected"
}
```




```




## API Endpoint

#### Register (Auth) POST
```http
/api/register
```
#### Login (Auth) POST
```http
/api/login
```
#### Create Profile POST
```http
/api/createProfile
```
#### Get Profile GET
```http
/api/getProfile
```

#### Update Profile PUT
```http
/api/updateProfile
```
#### Send Message CREATE
```http
/api/sendMessage
```
#### View Messages GET
```http
/api/viewMessages
```
## Environment Variables

Copy this following environtment variables to your `.env` file to run this project.

``` bash
DB_URI=mongodb+srv://SbhxKp6yVUfgoMEA:SbhxKp6yVUfgoMEA@cluster0.q65hmdh.mongodb.net/test-youapp?retryWrites=true&w=majority
MONGO_ATLAS_DB=test-youapp
MONGO_ATLAS_USER=SbhxKp6yVUfgoMEA
MONGO_ATLAS_PASSWORD=SbhxKp6yVUfgoMEA

JWT_SECRET=n3st4pp
JWT_EXPIRES=3d

APP_SECRET=n3st4pp

##RabbitMQ
MESSAGE_QUEUE_URL=amqp://rabbitmq:5672
# MESSAGE_QUEUE_URL = amqp://guest:guest@localhost:5672/ #For running locally only
# MESSAGE_QUEUE_URL = amqp://localhost:5672
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
