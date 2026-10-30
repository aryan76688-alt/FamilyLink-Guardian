import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { LocationService } from './location.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BatchLocationDto } from './dto/location.dto';

@Controller('api/location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(JwtAuthGuard)
  @Post('record')
  recordLocation(@Request() req: any, @Body() body: any) {
    const deviceId = req.user.id || req.user.sub;
    const points = 'points' in body && Array.isArray(body.points)
      ? body.points
      : (Array.isArray(body) ? body : [body]);
    return this.locationService.recordPoints(deviceId, points);
  }

  @UseGuards(JwtAuthGuard)
  @Get('family/latest')
  getFamilyLatest(@Request() req: any) {
    return this.locationService.getLatestLocationsForFamily(req.user.familyGroupId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('device/:deviceId/history')
  getHistory(
    @Param('deviceId') deviceId: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.locationService.getLocationHistory(deviceId, start, end);
  }
}
