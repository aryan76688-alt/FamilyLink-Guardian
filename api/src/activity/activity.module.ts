import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { WebSocketGatewayModule } from '../websocket/websocket-gateway.module';

@Module({
  imports: [PrismaModule, WebSocketGatewayModule],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
