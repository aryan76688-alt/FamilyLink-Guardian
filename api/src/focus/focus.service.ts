import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../websocket/events.gateway';
import { UpdateFocusModeDto } from './focus.dto';

@Injectable()
export class FocusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wsGateway: EventsGateway,
  ) {}

  async getFocusConfig(deviceId: string) {
    let config = await this.prisma.focusModeConfig.findUnique({
      where: { deviceId },
    });

    if (!config) {
      config = await this.prisma.focusModeConfig.create({
        data: {
          deviceId,
          enabled: false,
          modeName: 'Study Focus',
          scheduledStart: '18:00',
          scheduledEnd: '21:00',
          dndActive: false,
          blockedApps: ['com.instagram.android', 'com.zhiliaoapp.musically', 'com.google.android.youtube'],
        },
      });
    }

    return config;
  }

  async updateFocusConfig(dto: UpdateFocusModeDto) {
    const device = await this.prisma.device.findUnique({
      where: { id: dto.deviceId },
    });

    if (!device) {
      throw new NotFoundException(`Device ${dto.deviceId} not found`);
    }

    const updated = await this.prisma.focusModeConfig.upsert({
      where: { deviceId: dto.deviceId },
      create: {
        deviceId: dto.deviceId,
        enabled: dto.enabled ?? true,
        modeName: dto.modeName || 'Study Focus',
        scheduledStart: dto.scheduledStart,
        scheduledEnd: dto.scheduledEnd,
        dndActive: dto.dndActive ?? false,
        blockedApps: dto.blockedApps ?? undefined,
      },
      update: {
        enabled: dto.enabled,
        modeName: dto.modeName,
        scheduledStart: dto.scheduledStart,
        scheduledEnd: dto.scheduledEnd,
        dndActive: dto.dndActive,
        blockedApps: dto.blockedApps ?? undefined,
      },
    });

    // Notify the member's Android device over WebSocket to enforce DND and app restrictions
    this.wsGateway.broadcastFocusUpdate(dto.deviceId, updated);

    return updated;
  }
}
