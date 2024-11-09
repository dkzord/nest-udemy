import { Controller, Get } from '@nestjs/common';

@Controller('automatic-concepts')
export class AutomaticConceptsController {
  @Get()
  example(): string {
    return 'Exemplo de rota';
  }
}
