import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SimpleMiddleware } from 'src/common/middleware/simple.middleware';
import { GlobalConfigModule } from 'src/global-config/global-config.module';
import globalConfig from 'src/global-config/global.config';
import { MessagesModule } from 'src/messages/messages.module';
import { PeopleModule } from 'src/people/people.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forFeature(globalConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(globalConfig)],
      inject: [globalConfig.KEY],
      useFactory: async (
        globalConfiguration: ConfigType<typeof globalConfig>,
      ) => {
        return {
          type: globalConfiguration.database.type,
          host: globalConfiguration.database.host,
          port: globalConfiguration.database.port,
          username: globalConfiguration.database.username,
          database: globalConfiguration.database.database,
          password: globalConfiguration.database.password,
          autoLoadEntities: globalConfiguration.database.autoLoadEntities,
          synchronize: globalConfiguration.database.synchronize,
        };
      },
    }),
    MessagesModule,
    PeopleModule,
    GlobalConfigModule,
    AuthModule,
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
