import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { GeofenceService } from './geofence.service';
import { CreateGeofenceDto, RecordGeofenceEventDto } from './geofence.dto';

@Controller('api/geofence')
export class GeofenceController {
  constructor(private readonly geofenceService: GeofenceService) {}

  @Post()
  async createZone(@Body() dto: CreateGeofenceDto) {
    return this.geofenceService.createZone(dto);
  }

  @Get()
  async getZones(@Query('familyGroupId') familyGroupId: string) {
    return this.geofenceService.getZonesByFamily(familyGroupId);
  }

  @Delete(':id')
  async deleteZone(@Param('id') id: string) {
    return this.geofenceService.deleteZone(id);
  }

  @Post('event')
  async recordEvent(@Body() dto: RecordGeofenceEventDto) {
    return this.geofenceService.recordEvent(dto);
  }

  @Get('device/:deviceId/events')
  async getDeviceEvents(@Param('deviceId') deviceId: string) {
    return this.geofenceService.getEventsByDevice(deviceId);
  }
}
