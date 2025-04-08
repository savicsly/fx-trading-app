import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

export class JwtPayload {
  sub?: number;
  email: string;
  expiresIn?: string;
  // permissions?: Permission;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
    private authService: AuthService,
  ) {
    const secret = configService.getOrThrow<string>('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new Error('Invalid token payload: sub is missing');
    }
    const user = await this.usersService.findOne(payload.sub);

    if (!user) {
      return null;
    }

    return {
      user: {
        id: Number(payload.sub),
        email: payload.email,
      },
    };
  }
}
