import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PeopleService } from 'src/people/people.service';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { MessageEntity } from './entities/message.entity';

// Scope.DEFAULT means the service is a singleton, which is the default behavior in NestJS.
// Exist other scopes like Scope.REQUEST and Scope.TRANSIENT, but for this service, we will keep it as a singleton.
@Injectable({ scope: Scope.DEFAULT })
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly peopleService: PeopleService,
    private readonly configService: ConfigService,
  ) {}

  trowNotFoundError(error: string) {
    throw new NotFoundException(error);
  }

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const messages = await this.messageRepository.find({
      take: limit,
      skip: offset,
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

  async create(
    createMessageDto: CreateMessageDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const { toId } = createMessageDto;

    const toPerson = await this.peopleService.findOne(toId);
    const fromPerson = await this.peopleService.findOne(tokenPayload.sub);

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
        name: message.from.name,
      },
      to: {
        id: message.to.id,
        name: message.to.name,
      },
    };
  }

  async update(
    id: number,
    updateMessageDto: UpdateMessageDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const message = await this.findOne(id);

    if (message.from.id !== tokenPayload.sub) {
      throw new ForbiddenException(
        'You are not allowed to update this message',
      );
    }

    message.text = updateMessageDto?.text ?? message.text;
    message.read = updateMessageDto?.read ?? message.read;

    await this.messageRepository.save(message);

    return message;
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const message = await this.findOne(id);

    if (message.from.id !== tokenPayload.sub) {
      throw new ForbiddenException(
        'You are not allowed to delete this message',
      );
    }

    this.messageRepository.softDelete(message.id);

    return true;
  }
}
