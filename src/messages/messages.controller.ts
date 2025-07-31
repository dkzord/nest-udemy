import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { OnlyLowercaseLettersRegex } from 'src/common/regex/only-lowercase-letters.regex';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { MessagesService } from './messages.service';
import {
  ONLY_LOWERCASE_LETTERS_REGEX,
  REMOVE_SPACES_REGEX,
} from './server-name.constant';

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
@UseGuards(IsAdminGuard)
@Controller('messages')
@UsePipes(ParseIntIdPipe)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(REMOVE_SPACES_REGEX)
    private readonly removeSpacesRegex: RemoveSpacesRegex,
    @Inject(ONLY_LOWERCASE_LETTERS_REGEX)
    private readonly onlyLowercaseLettersRegex: OnlyLowercaseLettersRegex,
  ) {}

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
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.remove(id);
  }
}
