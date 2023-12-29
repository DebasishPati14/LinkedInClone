import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return data ? request.user[data] : request.user;
});
