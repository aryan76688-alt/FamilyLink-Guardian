import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../websocket/events.gateway';
import { LastGaspBeaconDto } from './beacon.dto';

@Injectable()
export class BeaconService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wsGateway: EventsGateway,
  ) {}

  async recordLastGasp(dto: LastGaspBeaconDto) {
    const device = await this.prisma.device.findUnique({
      where: { id: dto.deviceId },
    });

    if (!device) {
      throw new NotFoundException(`Device ${dto.deviceId} not found`);
    }

    const beacon = await this.prisma.lastGaspBeacon.create({
      data: {
        deviceId: dto.deviceId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        batteryLevel: dto.batteryLevel,
        wifiSsid: dto.wifiSsid,
        cellInfo: dto.cellInfo,
        triggerReason: dto.triggerReason,
      },
      include: {
        device: { select: { id: true, name: true } },
      },
    });

    // Also update device status
    await this.prisma.device.update({
      where: { id: dto.deviceId },
      data: {
        battery: dto.batteryLevel,
        isOnline: false,
        lastSeenAt: new Date(),
      },
    });

    // Record location point as final location
    await this.prisma.locationPoint.create({
      data: {
        deviceId: dto.deviceId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        battery: dto.batteryLevel,
        timestamp: new Date(),
        syncedAt: new Date(),
      },
    });

    this.wsGateway.broadcastLastGasp(device.familyGroupId, beacon);

    return beacon;
  }

  async getLatestLastGasp(deviceId: string) {
    return this.prisma.lastGaspBeacon.findFirst({
      where: { deviceId },
      orderBy: { timestamp: 'desc' },
      include: {
        device: { select: { id: true, name: true } },
      },
    });
  }
}
