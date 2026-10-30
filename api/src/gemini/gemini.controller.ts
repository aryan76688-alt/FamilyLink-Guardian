import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/ai')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('chat')
  chat(@Request() req: any, @Body('prompt') prompt: string) {
    return this.geminiService.askAssistant(req.user.id || req.user.sub, req.user.familyGroupId, prompt);
  }

  @Get('daily-recap')
  async getDailyRecap(@Query('familyGroupId') familyGroupId: string) {
    return this.geminiService.generateDailyRecap(familyGroupId);
  }

  @Get('route-anomaly')
  async getRouteAnomaly(@Query('deviceId') deviceId: string) {
    return this.geminiService.explainRouteAnomaly(deviceId);
  }
}
