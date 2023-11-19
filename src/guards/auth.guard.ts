import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    try {
      const res = this.authService.checkToken(
        (authorization ?? '').split(' ')[1],
      );

      const user = await this.userService.readOne(res.id);

      request.user = user;
      request.tokenInfo = res;

      return true;
    } catch {
      return false;
    }
  }
}
