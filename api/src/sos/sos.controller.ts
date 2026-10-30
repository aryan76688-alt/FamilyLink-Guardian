import { Controller, Post, Get, Body, Param, Query, Patch } from '@nestjs/common';
import { SosService } from './sos.service';
import { TriggerSosDto, ResolveSosDto } from './sos.dto';

@Controller('api/sos')
export class SosController {
  constructor(private readonly sosService: SosService) {}

  @Post('trigger')
  async triggerSos(@Body() dto: TriggerSosDto) {
    return this.sosService.triggerSos(dto);
  }

  @Patch(':id/resolve')
  async resolveSos(@Param('id') id: string, @Body() dto: ResolveSosDto) {
    return this.sosService.resolveSos(id, dto);
  }

  @Get('active')
  async getActiveAlerts(@Query('familyGroupId') familyGroupId?: string) {
    return this.sosService.getActiveAlerts(familyGroupId);
  }

  @Get('history')
  async getAlertHistory(@Query('familyGroupId') familyGroupId: string) {
    return this.sosService.getAlertHistory(familyGroupId);
  }
}
