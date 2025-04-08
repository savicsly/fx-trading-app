import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const AuthUserID = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<{ user: { user?: { id: string } } }>();
    const id = request.user.user?.id;

    if (!id) {
      console.error('User ID not configured. Is the AuthGuard in place?');
      throw new InternalServerErrorException();
    }

    return id;
  },
);
