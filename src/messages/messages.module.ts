import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from 'src/people/people.module';
import { MessageEntity } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesUtils } from './messages.utils';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([MessageEntity]),
    forwardRef(() => PeopleModule),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesUtils],
  exports: [MessagesUtils],
})
export class MessagesModule {}
