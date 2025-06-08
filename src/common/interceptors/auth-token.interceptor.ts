import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('AuthTokenInterceptor: Checking authentication token...');

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token || token !== 'f4bb1511-eb5a-4404-96f5-a08b777839f9') {
      throw new UnauthorizedException(
        'Unauthorized: Invalid or missing authentication token.',
      );
    }

    return next.handle();
  }
}
