import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { HashingServiceProtocol } from 'src/auth/hashing/hashing.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createPersonDto.password,
      );

      const dataNewPerson = {
        name: createPersonDto.name,
        email: createPersonDto.email,
        passwordHash,
      };

      const newPerson = this.personRepository.create(dataNewPerson);
      await this.personRepository.save(newPerson);

      return newPerson;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.personRepository.find({
      take: limit,
      skip: offset,
      where: { deletedAt: null },
      order: { id: 'desc' },
    });
  }

  findOne(id: number) {
    const person = this.personRepository.findOneBy({
      id,
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    return person;
  }

  async update(
    id: number,
    updatePersonDto: UpdatePersonDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const dataNewPerson = {
      ...(updatePersonDto?.name && { name: updatePersonDto?.name }),
      ...(updatePersonDto?.email && { email: updatePersonDto?.email }),
    };

    if (updatePersonDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updatePersonDto.password,
      );

      dataNewPerson['passwordHash'] = passwordHash;
    }

    const person = await this.personRepository.preload({
      id,
      ...dataNewPerson,
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    if (person.id !== tokenPayload.sub) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.personRepository.save(person);
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const person = await this.personRepository.findOne({
      where: { id },
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    if (person.id !== tokenPayload.sub) {
      throw new ForbiddenException('You can only delete your own profile');
    }

    return this.personRepository.softDelete(id);
  }
}
