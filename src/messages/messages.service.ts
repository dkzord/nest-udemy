import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PeopleService } from 'src/people/people.service';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly peopleService: PeopleService,
  ) {}

  trowNotFoundError(error: string) {
    throw new NotFoundException(error);
  }

  async findAll() {
    const messages = await this.messageRepository.find({
      relations: ['from', 'to'],
      where: { deletedAt: null },
      order: { id: 'desc' },
      select: {
        from: {
          id: true,
          name: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });

    return messages.filter((msg) => msg.from && msg.to);
  }

  async findOne(id: number) {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['from', 'to'],
      select: {
        from: {
          id: true,
          name: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });

    if (message) return message;

    this.trowNotFoundError('Message not found');
  }

  async create(createMessageDto: CreateMessageDto) {
    const { fromId, toId } = createMessageDto;

    // Encontrar o emissor e o destinatário
    const fromPerson = await this.peopleService.findOne(fromId);
    const toPerson = await this.peopleService.findOne(toId);

    const newMessage = {
      text: createMessageDto.text,
      from: fromPerson,
      to: toPerson,
      read: false,
      data: new Date(),
    };

    const message = await this.messageRepository.create(newMessage);
    await this.messageRepository.save(message);

    return {
      ...message,
      from: {
        id: message.from.id,
      },
      to: {
        id: message.to.id,
      },
    };
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
