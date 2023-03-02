import { Module } from '@nestjs/common';
import { EmailMessagesService } from './email-messages.service';
import { EmailMessagesResolver } from './email-messages.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailMessage, EmailMessageSchema } from './entities/email-message.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { MessagesWsModule } from '../messages-ws/messages-ws.module';
import { MessagesWsService } from '../messages-ws/messages-ws.service';

@Module({
  providers: [EmailMessagesResolver, EmailMessagesService, MessagesWsService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{
      name: EmailMessage.name,
      schema: EmailMessageSchema
    }]),
    UsersModule,
    MessagesWsModule
  ],
  exports: [
    MongooseModule,
    EmailMessagesModule
  ]
})
export class EmailMessagesModule { }
