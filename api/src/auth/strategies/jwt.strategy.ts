import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'super_secret_familylink_jwt_key_2026'),
    });
  }

  async validate(payload: { sub: string; email?: string; role?: string; type?: string; familyGroupId?: string }) {
    if (payload.type === 'DEVICE') {
      const device = await this.prisma.device.findUnique({
        where: { id: payload.sub },
      });
      if (!device) {
        throw new UnauthorizedException('Device not found or revoked');
      }
      return { id: device.id, sub: device.id, type: 'DEVICE', familyGroupId: device.familyGroupId, isDevice: true };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
