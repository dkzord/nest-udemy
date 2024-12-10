import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesService {
  getFindAll(): string {
    return 'This action returns all messages';
  }

  getFindOne(id: string): string {
    return `This action returns a #${id} message`;
  }

  create() {
    return `This action creates a new message`;
  }
}
