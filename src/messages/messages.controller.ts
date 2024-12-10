import {
  Get,
  Body,
  Post,
  Param,
  HttpCode,
  Controller,
  HttpStatus,
} from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(): string {
    return this.messagesService.getFindAll();
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
}
