import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const dataNewPerson = {
        name: createPersonDto.name,
        email: createPersonDto.email,
        passwordHash: createPersonDto.password,
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

  async findAll() {
    return await this.personRepository.find({
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

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    const dataNewPerson = {
      name: updatePersonDto?.name,
      email: updatePersonDto?.email,
      passwordHash: updatePersonDto?.password,
    };

    const person = await this.personRepository.preload({
      id,
      ...dataNewPerson,
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    return this.personRepository.save(person);
  }

  async remove(id: number) {
    const person = await this.personRepository.findOne({
      where: { id },
    });

    if (!person) {
      throw new NotFoundException('Person not found');
    }

    return this.personRepository.softDelete(id);
  }
}
