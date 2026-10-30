import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DevicesModule } from './devices/devices.module';
import { LocationModule } from './location/location.module';
import { MediaModule } from './media/media.module';
import { SyncModule } from './sync/sync.module';
import { WebSocketGatewayModule } from './websocket/websocket-gateway.module';
import { GeminiModule } from './gemini/gemini.module';
import { HealthModule } from './health/health.module';
import { SosModule } from './sos/sos.module';
import { GeofenceModule } from './geofence/geofence.module';
import { ActivityModule } from './activity/activity.module';
import { BeaconModule } from './beacon/beacon.module';
import { FocusModule } from './focus/focus.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DevicesModule,
    LocationModule,
    MediaModule,
    SyncModule,
    WebSocketGatewayModule,
    GeminiModule,
    HealthModule,
    SosModule,
    GeofenceModule,
    ActivityModule,
    BeaconModule,
    FocusModule,
  ],
})
export class AppModule {}
