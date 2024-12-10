import {
  Get,
  Body,
  Post,
  Param,
  HttpCode,
  Controller,
  HttpStatus,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
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
*/

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() pagination: any): any {
    console.log(pagination);
    const { limit = 10, offset = 0 } = pagination;

    return {
      limit,
      offset,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return this.messagesService.getFindOne(id);
  }

  @Post()
  create(@Body() body: any) {
    console.log(body);
    return this.messagesService.create();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    console.log(body);
    return {
      id,
      ...body,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
