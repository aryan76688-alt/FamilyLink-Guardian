import { Controller, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('session/:deviceId')
  requestSession(
    @Param('deviceId') deviceId: string,
    @Body('type') type: 'CAMERA' | 'VOICE' | 'SCREEN',
    @Request() req: any,
  ) {
    return this.mediaService.requestSession(deviceId, req.user.id || req.user.sub, type);
  }

  @Post('session/:sessionId/end')
  endSession(@Param('sessionId') sessionId: string, @Request() req: any) {
    return this.mediaService.endSession(sessionId, req.user.id || req.user.sub);
  }
}
