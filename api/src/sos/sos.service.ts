import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../websocket/events.gateway';
import { TriggerSosDto, ResolveSosDto } from './sos.dto';
import { SOSReason, SOSStatus } from '@prisma/client';

@Injectable()
export class SosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wsGateway: EventsGateway,
  ) {}

  async triggerSos(dto: TriggerSosDto) {
    const device = await this.prisma.device.findUnique({
      where: { id: dto.deviceId },
      include: { familyGroup: true },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${dto.deviceId} not found`);
    }

    const reason = (dto.reason as SOSReason) || SOSReason.MANUAL_SOS;

    const alert = await this.prisma.sOSAlert.create({
      data: {
        deviceId: dto.deviceId,
        status: SOSStatus.ACTIVE,
        reason,
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address,
        battery: dto.battery ?? device.battery,
        audioRecordingUrl: dto.audioRecordingUrl,
      },
      include: {
        device: {
          select: {
            id: true,
            name: true,
            battery: true,
            networkType: true,
          },
        },
      },
    });

    // Also update device last known location
    await this.prisma.locationPoint.create({
      data: {
        deviceId: dto.deviceId,
        latitude: dto.latitude,
        longitude: dto.longitude,
        battery: dto.battery ?? device.battery,
        timestamp: new Date(),
        syncedAt: new Date(),
      },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: dto.deviceId,
        actorType: 'DEVICE',
        deviceId: dto.deviceId,
        action: 'EMERGENCY_SOS_TRIGGERED',
        result: 'SUCCESS',
        metadata: {
          alertId: alert.id,
          reason,
          latitude: dto.latitude,
          longitude: dto.longitude,
        },
      },
    });

    // Broadcast instant high-priority emergency beacon to all guardians in family
    this.wsGateway.broadcastSosAlert(device.familyGroupId, alert);

    return alert;
  }

  async resolveSos(alertId: string, dto: ResolveSosDto) {
    const alert = await this.prisma.sOSAlert.findUnique({
      where: { id: alertId },
      include: { device: true },
    });

    if (!alert) {
      throw new NotFoundException(`SOS Alert ${alertId} not found`);
    }

    const status = (dto.status as SOSStatus) || SOSStatus.RESOLVED;

    const updated = await this.prisma.sOSAlert.update({
      where: { id: alertId },
      data: {
        status,
        resolvedAt: new Date(),
        resolvedBy: dto.resolvedBy || 'GUARDIAN',
      },
      include: {
        device: {
          select: { id: true, name: true },
        },
      },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: dto.resolvedBy || 'GUARDIAN',
        actorType: 'USER',
        deviceId: alert.deviceId,
        action: 'EMERGENCY_SOS_RESOLVED',
        result: status,
        metadata: { alertId, status },
      },
    });

    this.wsGateway.broadcastSosResolved(alert.device.familyGroupId, updated);

    return updated;
  }

  async getActiveAlerts(familyGroupId?: string) {
    return this.prisma.sOSAlert.findMany({
      where: {
        status: SOSStatus.ACTIVE,
        ...(familyGroupId ? { device: { familyGroupId } } : {}),
      },
      include: {
        device: {
          select: {
            id: true,
            name: true,
            battery: true,
            networkType: true,
            isOnline: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async getAlertHistory(familyGroupId: string, limit = 50) {
    return this.prisma.sOSAlert.findMany({
      where: { device: { familyGroupId } },
      include: {
        device: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
