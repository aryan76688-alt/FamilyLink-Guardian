import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../websocket/events.gateway';
import { CreateGeofenceDto, RecordGeofenceEventDto } from './geofence.dto';

@Injectable()
export class GeofenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wsGateway: EventsGateway,
  ) {}

  async createZone(dto: CreateGeofenceDto) {
    const zone = await this.prisma.geofenceZone.create({
      data: {
        familyGroupId: dto.familyGroupId,
        name: dto.name,
        type: dto.type || 'SAFE',
        polygonCoordinates: dto.polygonCoordinates ?? undefined,
        centerLat: dto.centerLat,
        centerLng: dto.centerLng,
        radiusMeters: dto.radiusMeters,
        notifyOnEnter: dto.notifyOnEnter ?? true,
        notifyOnExit: dto.notifyOnExit ?? true,
      },
    });

    return zone;
  }

  async getZonesByFamily(familyGroupId: string) {
    return this.prisma.geofenceZone.findMany({
      where: { familyGroupId },
      include: {
        events: {
          orderBy: { timestamp: 'desc' },
          take: 5,
          include: {
            device: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteZone(id: string) {
    return this.prisma.geofenceZone.delete({
      where: { id },
    });
  }

  async recordEvent(dto: RecordGeofenceEventDto) {
    const device = await this.prisma.device.findUnique({
      where: { id: dto.deviceId },
    });

    if (!device) {
      throw new NotFoundException(`Device ${dto.deviceId} not found`);
    }

    const event = await this.prisma.geofenceEvent.create({
      data: {
        deviceId: dto.deviceId,
        geofenceZoneId: dto.geofenceZoneId,
        eventType: dto.eventType,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
      include: {
        geofenceZone: true,
        device: { select: { id: true, name: true } },
      },
    });

    // Broadcast transition to family
    this.wsGateway.broadcastGeofenceEvent(device.familyGroupId, event);

    return event;
  }

  async getEventsByDevice(deviceId: string, limit = 20) {
    return this.prisma.geofenceEvent.findMany({
      where: { deviceId },
      include: { geofenceZone: true },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }
}
