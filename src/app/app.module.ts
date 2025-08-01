import * as Joi from '@hapi/joi';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimpleMiddleware } from 'src/common/middleware/simple.middleware';
import { MessagesModule } from 'src/messages/messages.module';
import { PeopleModule } from 'src/people/people.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_TYPE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNCHRONIZE: Joi.number().min(0).max(1).default(0),
        DB_AUTO_LOAD_ENTITIES: Joi.number().min(0).max(1).default(0),
      }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: Boolean(process.env.DB_SYNCHRONIZE),
      synchronize: Boolean(process.env.DB_AUTO_LOAD_ENTITIES),
    }),
    MessagesModule,
    PeopleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SimpleMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
