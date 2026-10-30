import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET', 'super_secret_familylink_jwt_key_2026'),
      });

      client.data.user = payload;
      if (payload.familyGroupId) {
        client.join(`family:${payload.familyGroupId}`);
      }
      if (payload.type === 'DEVICE') {
        client.join(`device:${payload.sub}`);
        await this.prisma.device.update({
          where: { id: payload.sub },
          data: { isOnline: true, lastSeenAt: new Date() },
        });
        this.server.to(`family:${payload.familyGroupId}`).emit('DEVICE_ONLINE', { deviceId: payload.sub });
      }
    } catch (e) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const user = client.data?.user;
    if (user && user.type === 'DEVICE') {
      await this.prisma.device.update({
        where: { id: user.sub },
        data: { isOnline: false, lastSeenAt: new Date() },
      });
      this.server.to(`family:${user.familyGroupId}`).emit('DEVICE_OFFLINE', { deviceId: user.sub });
    }
  }

  @SubscribeMessage('heartbeat')
  async handleHeartbeat(@ConnectedSocket() client: Socket, @MessageBody() data: { battery: number; networkType: string }) {
    const user = client.data?.user;
    if (user && user.type === 'DEVICE') {
      await this.prisma.device.update({
        where: { id: user.sub },
        data: {
          battery: data.battery,
          networkType: data.networkType,
          lastSeenAt: new Date(),
        },
      });
      this.server.to(`family:${user.familyGroupId}`).emit('BATTERY_UPDATED', {
        deviceId: user.sub,
        battery: data.battery,
        networkType: data.networkType,
      });
    }
  }

  @SubscribeMessage('location_update')
  handleLocationUpdate(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const user = client.data?.user;
    if (user) {
      this.server.to(`family:${user.familyGroupId}`).emit('LOCATION_UPDATED', {
        deviceId: user.sub,
        ...data,
      });
    }
  }

  // WebRTC P2P Signaling Relays
  @SubscribeMessage('webrtc_offer')
  handleWebRtcOffer(@MessageBody() payload: { targetDeviceId: string; sdp: any }, @ConnectedSocket() client: Socket) {
    this.server.to(`device:${payload.targetDeviceId}`).emit('webrtc_offer', {
      from: client.data?.user?.sub,
      sdp: payload.sdp,
    });
  }

  @SubscribeMessage('webrtc_answer')
  handleWebRtcAnswer(@MessageBody() payload: { targetGuardianId: string; sdp: any }, @ConnectedSocket() client: Socket) {
    this.server.to(`family:${client.data?.user?.familyGroupId}`).emit('webrtc_answer', {
      fromDevice: client.data?.user?.sub,
      sdp: payload.sdp,
    });
  }

  @SubscribeMessage('ice_candidate')
  handleIceCandidate(@MessageBody() payload: { target: string; candidate: any }, @ConnectedSocket() client: Socket) {
    this.server.to(`device:${payload.target}`).emit('ice_candidate', {
      from: client.data?.user?.sub,
      candidate: payload.candidate,
    });
  }

  // Emergency SOS Broadcasts
  broadcastSosAlert(familyGroupId: string, alert: any) {
    if (this.server) {
      this.server.to(`family:${familyGroupId}`).emit('SOS_ALERT_TRIGGERED', alert);
    }
  }

  broadcastSosResolved(familyGroupId: string, alert: any) {
    if (this.server) {
      this.server.to(`family:${familyGroupId}`).emit('SOS_ALERT_RESOLVED', alert);
    }
  }

  // Geofence Events
  broadcastGeofenceEvent(familyGroupId: string, event: any) {
    if (this.server) {
      this.server.to(`family:${familyGroupId}`).emit('GEOFENCE_TRANSITION', event);
    }
  }

  // Activity Updates
  broadcastActivityUpdate(familyGroupId: string, activity: any) {
    if (this.server) {
      this.server.to(`family:${familyGroupId}`).emit('ACTIVITY_UPDATED', activity);
    }
  }

  // Last Gasp Battery Beacons
  broadcastLastGasp(familyGroupId: string, beacon: any) {
    if (this.server) {
      this.server.to(`family:${familyGroupId}`).emit('LAST_GASP_BEACON', beacon);
    }
  }

  // Focus Mode Sync
  broadcastFocusUpdate(deviceId: string, config: any) {
    if (this.server) {
      this.server.to(`device:${deviceId}`).emit('FOCUS_MODE_CONFIG', config);
    }
  }
}
