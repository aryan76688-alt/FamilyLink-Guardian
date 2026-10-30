import { Module } from '@nestjs/common';
import { FocusService } from './focus.service';
import { FocusController } from './focus.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WebSocketGatewayModule } from '../websocket/websocket-gateway.module';

@Module({
  imports: [PrismaModule, WebSocketGatewayModule],
  controllers: [FocusController],
  providers: [FocusService],
  exports: [FocusService],
})
export class FocusModule {}
