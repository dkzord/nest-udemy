import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  trowNotFoundError(error: string) {
    throw new NotFoundException(error);
  }

  async findAll() {
    const messages = await this.messageRepository.find();

    return messages;
  }

  async findOne(id: number) {
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (message) return message;

    this.trowNotFoundError('Message not found');
  }

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = {
      ...createMessageDto,
      read: false,
      data: new Date(),
    };

    const message = await this.messageRepository.create(newMessage);
    return this.messageRepository.save(message);
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const partialUpdateDto = {
      read: updateMessageDto.read,
      text: updateMessageDto.text,
    };
    const message = await this.messageRepository.preload({
      id,
      ...partialUpdateDto,
    });

    if (message) return this.messageRepository.save(message);

    this.trowNotFoundError('Message not found');
  }

  async remove(id: number) {
    this.messageRepository.softDelete(id);

    return true;
  }
}
