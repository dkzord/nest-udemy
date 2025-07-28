import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers?.authorization;
    console.log('SimpleMiddleware: Iniciou', authorization);

    if (authorization) {
      req['user'] = {
        nome: 'Luiz',
        sobrenome: 'Otávio',
        role: 'user',
      };
    }

    next();

    res.on('finish', () => {
      console.log('SimpleMiddleware: Terminou');
    });
  }
}
