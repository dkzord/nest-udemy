import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';

@Injectable()
export class MessagesService {
  private lastId = 1;
  private messages: MessageEntity[] = [
    {
      id: 1,
      text: 'Hello world! It`s a test message',
      from: 'John Doe',
      to: 'Jane Doe',
      read: false,
      data: new Date(),
    },
  ];

  trowNotFoundError(error: string) {
    // throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    //  thorw new BadRequestException(error);

    throw new NotFoundException(error);
  }

  findAll() {
    return this.messages;
  }

  findOne(id: string) {
    const message = this.messages.find((message) => message.id === +id);

    if (message) {
      return message;
    }

    this.trowNotFoundError('Message not found');
  }

  create(createMessageDto: CreateMessageDto) {
    this.lastId++;
    const id = this.lastId;
    const newMessage = {
      id,
      ...createMessageDto,
      read: false,
      data: new Date(),
    };

    this.messages.push(newMessage);
    return newMessage;
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    const indexMessageExists = this.messages.findIndex(
      (message) => message.id === +id,
    );

    if (indexMessageExists === -1) {
      return this.trowNotFoundError('Message not found');
    }

    const updatedMessage = (this.messages[indexMessageExists] = {
      ...this.messages[indexMessageExists],
      ...updateMessageDto,
    });

    return updatedMessage;
  }

  remove(id: string) {
    const indexMessageExists = this.messages.findIndex(
      (message) => message.id === +id,
    );

    if (indexMessageExists === -1) {
      return this.trowNotFoundError('Message not found');
    }

    const messsage = this.messages.splice(indexMessageExists, 1);

    return messsage;
  }
}
