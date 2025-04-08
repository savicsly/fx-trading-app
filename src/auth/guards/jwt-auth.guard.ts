import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { META_PUBLIC_RESOURCE } from 'src/shared/decorator/public-resource.decorator';

@Injectable()
export class CustomAuthGuard extends NestAuthGuard(['jwt']) {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(
      META_PUBLIC_RESOURCE,
      [context.getClass(), context.getHandler()],
    );

    if (skipAuth) return true;

    return super.canActivate(context);
  }

  handleRequest(err, data, _info, _context: ExecutionContext, _status) {
    if (err || !data) {
      throw err || new UnauthorizedException();
    }

    return data;
  }
}

@Injectable()
export class AuthGuard extends CustomAuthGuard {}
