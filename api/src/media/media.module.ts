import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { WebSocketGatewayModule } from '../websocket/websocket-gateway.module';

@Module({
  imports: [WebSocketGatewayModule],
  providers: [MediaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
