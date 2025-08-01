import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyDynamicModule } from 'src/my-dynamic/my-dynamic.module';
import { PeopleModule } from 'src/people/people.module';
import { MessageEntity } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesUtils } from './messages.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    forwardRef(() => PeopleModule),
    MyDynamicModule.register({
      apiKey: 'KEY',
      apiUrl: 'https://api.example.com',
    }),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesUtils],
  exports: [MessagesUtils],
})
export class MessagesModule {}
