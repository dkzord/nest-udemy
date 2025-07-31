import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegexFactory } from 'src/common/regex/regex.factory';
import { PeopleModule } from 'src/people/people.module';
import { MessageEntity } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesUtils } from './messages.utils';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
} from './server-name.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    forwardRef(() => PeopleModule),
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
    MessagesUtils,
    RegexFactory,
    {
      provide: REMOVE_SPACES_REGEX,
      useFactory: (regexFactory: RegexFactory) => {
        return regexFactory.create('RemoveSpacesRegex');
      },
      inject: [RegexFactory],
    },
    {
      provide: ONLY_LOWERCASE_LETTERS_REGEX,
      useFactory: (regexFactory: RegexFactory) => {
        return regexFactory.create('OnlyLowercaseLettersRegex');
      },
      inject: [RegexFactory],
    },
  ],
  exports: [MessagesUtils],
})
export class MessagesModule {}
