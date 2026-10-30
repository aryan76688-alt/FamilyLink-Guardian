import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../websocket/events.gateway';
import { RecordActivityDto } from './activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wsGateway: EventsGateway,
  ) {}

  async recordActivity(dto: RecordActivityDto) {
    const device = await this.prisma.device.findUnique({
      where: { id: dto.deviceId },
    });

    if (!device) {
      throw new NotFoundException(`Device ${dto.deviceId} not found`);
    }

    const log = await this.prisma.activityLog.create({
      data: {
        deviceId: dto.deviceId,
        activityType: dto.activityType,
        confidence: dto.confidence ?? 100,
        speedKmh: dto.speedKmh,
      },
      include: {
        device: { select: { id: true, name: true } },
      },
    });

    this.wsGateway.broadcastActivityUpdate(device.familyGroupId, log);

    return log;
  }

  async getLatestActivity(deviceId: string) {
    return this.prisma.activityLog.findFirst({
      where: { deviceId },
      orderBy: { timestamp: 'desc' },
      include: {
        device: { select: { id: true, name: true } },
      },
    });
  }

  async getActivityHistory(deviceId: string, limit = 50) {
    return this.prisma.activityLog.findMany({
      where: { deviceId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }
}
