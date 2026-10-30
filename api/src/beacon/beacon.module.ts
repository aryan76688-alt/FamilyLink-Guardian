import { Module } from '@nestjs/common';
import { BeaconService } from './beacon.service';
import { BeaconController } from './beacon.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WebSocketGatewayModule } from '../websocket/websocket-gateway.module';

@Module({
  imports: [PrismaModule, WebSocketGatewayModule],
  controllers: [BeaconController],
  providers: [BeaconService],
  exports: [BeaconService],
})
export class BeaconModule {}
