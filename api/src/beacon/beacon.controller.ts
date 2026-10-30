import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { BeaconService } from './beacon.service';
import { LastGaspBeaconDto } from './beacon.dto';

@Controller('api/beacon')
export class BeaconController {
  constructor(private readonly beaconService: BeaconService) {}

  @Post('last-gasp')
  async recordLastGasp(@Body() dto: LastGaspBeaconDto) {
    return this.beaconService.recordLastGasp(dto);
  }

  @Get(':deviceId/last-gasp')
  async getLatestLastGasp(@Param('deviceId') deviceId: string) {
    return this.beaconService.getLatestLastGasp(deviceId);
  }
}
