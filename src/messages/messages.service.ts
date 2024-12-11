import { Injectable } from '@nestjs/common';
import { MessageEntity } from './entities/message.entity';

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

  findAll() {
    return this.messages;
  }

  findOne(id: string) {
    return this.messages.find((message) => message.id === +id);
  }

  create(body: any) {
    this.lastId++;
    const id = this.lastId;
    const newMessage = {
      id,
      ...body,
    };

    this.messages.push(newMessage);
    return newMessage;
  }

  update(id: string, body: any) {
    const indexMessageExists = this.messages.findIndex(
      (message) => message.id === +id,
    );

    if (indexMessageExists === -1) {
      return 'Message not found';
    }

    const updatedMessage = (this.messages[indexMessageExists] = {
      ...this.messages[indexMessageExists],
      ...body,
    });

    return updatedMessage;
  }

  remove(id: string) {
    const indexMessageExists = this.messages.findIndex(
      (message) => message.id === +id,
    );

    if (indexMessageExists === -1) {
      return 'Message not found';
    }

    this.messages.splice(indexMessageExists, 1);

    return 'Message removed';
  }
}
