import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LocationRecordDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  async recordPoints(deviceId: string, points: LocationRecordDto[]) {
    const data = points.map((p) => ({
      deviceId,
      latitude: p.latitude,
      longitude: p.longitude,
      accuracy: p.accuracy ?? 10.0,
      speed: p.speed ?? 0.0,
      heading: p.heading ?? 0.0,
      battery: p.battery ?? 100,
      isOfflineQueued: p.isOfflineQueued ?? false,
      timestamp: p.timestamp ? new Date(p.timestamp) : new Date(),
    }));

    if (data.length > 0) {
      await this.prisma.locationPoint.createMany({ data });
      const lastPoint = points[points.length - 1];
      await this.prisma.device.update({
        where: { id: deviceId },
        data: {
          lastSeenAt: lastPoint.timestamp ? new Date(lastPoint.timestamp) : new Date(),
          isOnline: true,
          battery: lastPoint.battery !== undefined ? lastPoint.battery : undefined,
        },
      });
    }

    return { recorded: points.length, status: 'OK' };
  }

  async getLatestLocationsForFamily(familyGroupId: string) {
    const devices = await this.prisma.device.findMany({
      where: { familyGroupId, status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        battery: true,
        isOnline: true,
        lastSeenAt: true,
        permissions: true,
        locations: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    return devices.map((d) => ({
      deviceId: d.id,
      name: d.name,
      battery: d.battery,
      isOnline: d.isOnline,
      lastSeenAt: d.lastSeenAt,
      permissions: d.permissions,
      location: d.locations[0] || null,
    }));
  }

  async getLocationHistory(deviceId: string, start?: string, end?: string) {
    const startDate = start ? new Date(start) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    const endDate = end ? new Date(end) : new Date();

    return this.prisma.locationPoint.findMany({
      where: {
        deviceId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: 'asc' },
    });
  }
}
