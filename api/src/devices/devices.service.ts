import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getDevicesForFamily(familyGroupId: string) {
    return this.prisma.device.findMany({
      where: { familyGroupId, status: 'ACTIVE' },
      include: {
        permissions: true,
        locations: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastSeenAt: 'desc' },
    });
  }

  async getDeviceById(id: string, familyGroupId: string) {
    const device = await this.prisma.device.findFirst({
      where: { id, familyGroupId },
      include: {
        permissions: true,
        locations: {
          orderBy: { timestamp: 'desc' },
          take: 50,
        },
        auditLogs: {
          orderBy: { timestamp: 'desc' },
          take: 20,
        },
      },
    });
    if (!device) throw new NotFoundException('Device not found');
    return device;
  }

  async updateName(id: string, name: string, familyGroupId: string) {
    return this.prisma.device.updateMany({
      where: { id, familyGroupId },
      data: { name },
    });
  }

  async updatePermissions(deviceId: string, updateData: any) {
    return this.prisma.devicePermissions.upsert({
      where: { deviceId },
      update: updateData,
      create: {
        deviceId,
        ...updateData,
      },
    });
  }

  async updateTelemetry(deviceId: string, battery: number, networkType: string, isOnline = true) {
    return this.prisma.device.update({
      where: { id: deviceId },
      data: {
        battery,
        networkType,
        isOnline,
        lastSeenAt: new Date(),
      },
    });
  }

  async revokeDevice(deviceId: string, familyGroupId: string) {
    return this.prisma.device.updateMany({
      where: { id: deviceId, familyGroupId },
      data: { status: 'REVOKED', isOnline: false },
    });
  }
}
