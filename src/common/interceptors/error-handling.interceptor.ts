import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('ErrorHandlingInterceptor: Intercepting request...');

    return next.handle().pipe(
      catchError((error: any) => {
        return throwError(() => {
          if (error.name === 'NotFoundException') {
            return new BadRequestException(error.message);
          }
          return new BadRequestException(
            'An unexpected error occurred. Please try again later.',
          );
        });
      }),
    );
  }
}
