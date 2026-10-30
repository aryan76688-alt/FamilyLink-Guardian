import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../websocket/events.gateway';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async requestSession(deviceId: string, guardianId: string, type: 'CAMERA' | 'VOICE' | 'SCREEN') {
    const device = await this.prisma.device.findUnique({
      where: { id: deviceId },
      include: { permissions: true },
    });
    if (!device) throw new BadRequestException('Device not found');

    if (type === 'CAMERA' && !device.permissions?.cameraEnabled) {
      throw new BadRequestException('Camera permission is disabled by the family member.');
    }
    if (type === 'VOICE' && !device.permissions?.microphoneEnabled) {
      throw new BadRequestException('Microphone permission is disabled by the family member.');
    }
    if (type === 'SCREEN' && !device.permissions?.screenShareEnabled) {
      throw new BadRequestException('Screen sharing permission is disabled by the family member.');
    }

    const session = await this.prisma.deviceSession.create({
      data: {
        deviceId,
        type,
        status: 'REQUESTED',
        requestedBy: guardianId,
      },
    });

    this.eventsGateway.server.to(`device:${deviceId}`).emit(`${type}_SESSION_REQUEST`, {
      sessionId: session.id,
      type,
      requestedBy: guardianId,
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: guardianId,
        actorType: 'GUARDIAN',
        deviceId,
        action: `REQUEST_${type}_SESSION`,
        result: 'REQUESTED',
      },
    });

    return session;
  }

  async endSession(sessionId: string, actorId: string) {
    const session = await this.prisma.deviceSession.update({
      where: { id: sessionId },
      data: { status: 'ENDED', endedAt: new Date() },
    });

    this.eventsGateway.server.to(`device:${session.deviceId}`).emit('SESSION_ENDED', { sessionId });

    return session;
  }
}
