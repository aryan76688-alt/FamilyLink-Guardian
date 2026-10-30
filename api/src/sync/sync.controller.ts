import { Controller, Post, Patch, Get, Body, Param, UseGuards } from '@nestjs/common';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('job')
  createJob(@Body() body: { deviceId: string; type: string; itemCount: number; checksum?: string }) {
    return this.syncService.createJob(body.deviceId, body.type, body.itemCount, body.checksum);
  }

  @Patch('job/:id')
  updateJob(@Param('id') id: string, @Body() body: { status: any; checksum?: string; errorMessage?: string }) {
    return this.syncService.updateJob(id, body.status, body.checksum, body.errorMessage);
  }

  @Get('device/:deviceId/pending')
  getPending(@Param('deviceId') deviceId: string) {
    return this.syncService.getPendingJobs(deviceId);
  }
}
