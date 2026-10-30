import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('pairing-code')
  getPairingCode(@Request() req: any) {
    return this.authService.generatePairingCode(req.user.id, req.user.familyGroupId);
  }

  @Post('pair-device')
  pairDevice(@Body() body: { pairingCode: string; deviceName: string; publicKey: string; platform?: string }) {
    return this.authService.pairDevice(body.pairingCode, body.deviceName, body.publicKey, body.platform);
  }
}
