import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user;

    if (user) {
      if (data) {
        if (user[data]) {
          return user[data];
        } else {
          throw new NotFoundException('Parameter not found.');
        }
      }

      return user;
    } else {
      throw new NotFoundException('User not found.');
    }
  },
);
