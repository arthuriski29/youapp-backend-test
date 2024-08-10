//FOR LOCAL
// import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// import { AppModule } from './app.module';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule, {
//     rawBody: true,
//   });
//   app.useGlobalPipes(new ValidationPipe());

//   // Set up microservices
//   app.connectMicroservice<MicroserviceOptions>({
//     transport: Transport.RMQ,
//     options: {
//       urls: [process.env.MESSAGE_QUEUE_URL || 'amqp://rabbitmq:5672'],
//       queue: 'chat_queue',
//       queueOptions: {
//         durable: false,
//       },
//     },
//   });

//   await app.startAllMicroservices();

//   await app.listen(3000);
// }
// bootstrap();

//FOR Dockercompose
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function connectWithRetry(app: NestExpressApplication, url: string) {
  let retries = 5; // Number of retries
  while (retries) {
    try {
      // Attempt to connect to RabbitMQ
      console.log(`Connecting to RabbitMQ at ${url}...`);
      await app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
          urls: [url],
          queue: 'chat_queue',
          queueOptions: {
            durable: false,
          },
        },
      });
      console.log('Connected to RabbitMQ successfully!');

      await app.startAllMicroservices();
      break; // Exit loop if connection is successful
    } catch (error) {
      console.error('Failed to connect to RabbitMQ, retrying...', error);
      await new Promise((res) => setTimeout(res, 1000));
      retries--;
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  // Connect to RabbitMQ with retry logic
  const messageQueueUrl =
    process.env.MESSAGE_QUEUE_URL || 'amqp://rabbitmq:5672';
  await connectWithRetry(app, messageQueueUrl);

  // Start the HTTP server
  await app.listen(3000);
}

bootstrap();
