import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class TimingConnectionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const start = Date.now();
    const nameController = context.getClass().name;

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - start;
        console.log(
          `Request took ${elapsed}ms in controller ${nameController}`,
        );
      }),
    );
  }
}
