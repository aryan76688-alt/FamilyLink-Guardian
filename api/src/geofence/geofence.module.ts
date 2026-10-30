import { Module } from '@nestjs/common';
import { GeofenceService } from './geofence.service';
import { GeofenceController } from './geofence.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WebSocketGatewayModule } from '../websocket/websocket-gateway.module';

@Module({
  imports: [PrismaModule, WebSocketGatewayModule],
  controllers: [GeofenceController],
  providers: [GeofenceService],
  exports: [GeofenceService],
})
export class GeofenceModule {}
