import { Module } from '@nestjs/common';
import { SosService } from './sos.service';
import { SosController } from './sos.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WebSocketGatewayModule } from '../websocket/websocket-gateway.module';

@Module({
  imports: [PrismaModule, WebSocketGatewayModule],
  controllers: [SosController],
  providers: [SosService],
  exports: [SosService],
})
export class SosModule {}
