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

  private messages: MessageEntity[] = [
    {
      id: 1,
      text: 'Hello world! It`s a test message',
      from: 'John Doe',
      to: 'Jane Doe',
      read: false,
      data: new Date(),
      deletedAt: null,
    },
  ];

  trowNotFoundError(error: string) {
    // throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
    //  thorw new BadRequestException(error);

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
    const message = await this.messageRepository.preload({
      id,
      ...updateMessageDto,
    });

    if (message) return this.messageRepository.save(message);

    this.trowNotFoundError('Message not found');
  }

  async remove(id: number) {
    const message = await this.messageRepository.findOneBy({
      id,
    });

    if (message) return this.messageRepository.remove(message);

    this.trowNotFoundError('Message not found');
  }
}
