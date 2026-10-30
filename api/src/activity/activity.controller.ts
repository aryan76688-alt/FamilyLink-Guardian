import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { RecordActivityDto } from './activity.dto';

@Controller('api/activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post('record')
  async recordActivity(@Body() dto: RecordActivityDto) {
    return this.activityService.recordActivity(dto);
  }

  @Get(':deviceId/latest')
  async getLatestActivity(@Param('deviceId') deviceId: string) {
    return this.activityService.getLatestActivity(deviceId);
  }

  @Get(':deviceId/history')
  async getActivityHistory(
    @Param('deviceId') deviceId: string,
    @Query('limit') limit?: string,
  ) {
    return this.activityService.getActivityHistory(deviceId, limit ? parseInt(limit, 10) : 50);
  }
}
