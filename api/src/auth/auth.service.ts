import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface PairingStore {
  code: string;
  familyGroupId: string;
  guardianId: string;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private static pairingCodes = new Map<string, PairingStore>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const familyGroup = await this.prisma.familyGroup.create({
      data: {
        name: `${dto.name}'s Family`,
        guardianId: '',
      },
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: 'GUARDIAN',
        familyGroupId: familyGroup.id,
      },
    });

    await this.prisma.familyGroup.update({
      where: { id: familyGroup.id },
      data: { guardianId: user.id },
    });

    return this.generateTokens(user.id, user.email, user.role, familyGroup.id);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email, user.role, user.familyGroupId || '');
  }

  async generatePairingCode(guardianId: string, familyGroupId: string) {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const expiresAt = Date.now() + 15 * 60 * 1000;
    AuthService.pairingCodes.set(code, {
      code,
      familyGroupId,
      guardianId,
      expiresAt,
    });

    return {
      code,
      expiresAt: new Date(expiresAt).toISOString(),
      qrPayload: JSON.stringify({ code, familyGroupId, timestamp: Date.now() }),
    };
  }

  async pairDevice(pairingCode: string, deviceName: string, publicKey: string, platform = 'Android') {
    const record = AuthService.pairingCodes.get(pairingCode.toUpperCase());
    if (!record || Date.now() > record.expiresAt) {
      throw new BadRequestException('Invalid or expired pairing code.');
    }

    const device = await this.prisma.device.create({
      data: {
        name: deviceName,
        familyGroupId: record.familyGroupId,
        platform,
        status: 'ACTIVE',
        isOnline: true,
        permissions: {
          create: {
            locationEnabled: true,
            cameraEnabled: false,
            microphoneEnabled: false,
            screenShareEnabled: false,
            cloudBackupEnabled: true,
          },
        },
        keys: {
          create: {
            publicKey,
          },
        },
      },
      include: {
        permissions: true,
      },
    });

    AuthService.pairingCodes.delete(pairingCode.toUpperCase());

    const token = this.jwtService.sign(
      { sub: device.id, type: 'DEVICE', familyGroupId: record.familyGroupId },
      { expiresIn: '365d' },
    );

    return {
      deviceId: device.id,
      deviceToken: token,
      familyGroupId: record.familyGroupId,
      permissions: device.permissions,
    };
  }

  private generateTokens(userId: string, email: string, role: string, familyGroupId: string) {
    const payload = { sub: userId, email, role, familyGroupId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET', 'super_secret_familylink_jwt_key_2026'),
      expiresIn: '7d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET', 'super_secret_familylink_refresh_key_2026'),
      expiresIn: '30d',
    });

    return { accessToken, refreshToken, user: { id: userId, email, role, familyGroupId } };
  }
}
