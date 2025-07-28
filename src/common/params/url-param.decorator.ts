import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UrlParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request: Request = context.getRequest();

    return request.url;
  },
);
