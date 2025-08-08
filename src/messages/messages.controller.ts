import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { MessagesService } from './messages.service';

/* 
  CRUD:
    Create: POST -> Create a new message
    Read: GET -> Get all messages
    Read: GET -> Get a specific message
    Update: PATCH/PUT -> Update a specific message
      PATCH -> Update a specific field of a specific message
        PT-BR: Usado para atualizar dados de um recurso, ou seja, atualiza um trecho de um recurso.
      PUT -> Update a specific message
        PT-BR: Usado para atualizar um recurso, ou seja, atualiza todo o recurso (o objeto inteiro).
    Delete: DELETE -> Delete a specific message

  DTO: nest g cl messages/dtos/create-message.dto --no-spec --flat
    Data Transfer Object (DTO) é um padrão de projeto de software usado para transferir dados entre subsistemas de um software. DTOs são frequentemente usados em conjunção com objetos de acesso a dados para obter dados de um banco de dados.
    Os DTOs no Nest são classes simples que são usadas para transferir dados entre objetos. Eles podem ser usados para validar dados, para transformar dados, para transferir dados entre diferentes partes do sistema ou para enviar dados para um cliente.
*/

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() paginationDto: PaginationDto): any {
    return this.messagesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.messagesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthTokenGuard)
  create(
    @Body() createMessageDto: CreateMessageDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messagesService.create(createMessageDto, tokenPayload);
  }

  @Patch(':id')
  @UseGuards(AuthTokenGuard)
  update(
    @Param('id') id: number,
    @Body() updateMessageDto: UpdateMessageDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messagesService.update(id, updateMessageDto, tokenPayload);
  }

  @Delete(':id')
  @UseGuards(AuthTokenGuard)
  remove(
    @Param('id') id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messagesService.remove(id, tokenPayload);
  }
}
