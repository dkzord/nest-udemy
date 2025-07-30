import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesUtils {
  invertString(str: string) {
    return str.split('').reverse().join('');
  }
}
