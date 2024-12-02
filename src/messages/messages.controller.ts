import { Controller, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll(): string {
    return this.messagesService.getFindAll();
  }

  @Get(':id')
  findOne(@Param('id') id: any): string {
    return this.messagesService.getFindOne(id);
  }
}
