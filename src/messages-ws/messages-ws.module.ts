import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [MessagesWsGateway, MessagesWsService],
  imports: [AuthModule, UsersModule],
  exports: [MessagesWsModule, MessagesWsGateway]
})
export class MessagesWsModule { }
