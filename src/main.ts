import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json());
  app.useGlobalPipes(new ValidationPipe());

  app.use((req, res, next) => {
    Logger.log(`Request URL: ${req.url} | Body: ${JSON.stringify(req.body)}`);
    next();
  });

  await app.listen(3333);
}
bootstrap();
