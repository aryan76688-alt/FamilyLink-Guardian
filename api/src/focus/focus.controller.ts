import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { FocusService } from './focus.service';
import { UpdateFocusModeDto } from './focus.dto';

@Controller('api/focus')
export class FocusController {
  constructor(private readonly focusService: FocusService) {}

  @Get(':deviceId')
  async getFocusConfig(@Param('deviceId') deviceId: string) {
    return this.focusService.getFocusConfig(deviceId);
  }

  @Post('update')
  async updateFocusConfig(@Body() dto: UpdateFocusModeDto) {
    return this.focusService.updateFocusConfig(dto);
  }
}
