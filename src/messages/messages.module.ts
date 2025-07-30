import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleModule } from 'src/people/people.module';
import { MessageEntity } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesUtils } from './messages.utils';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity]), PeopleModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesUtils],
})
export class MessagesModule {}
