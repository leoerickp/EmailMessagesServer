import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService, UsersService],
  imports: [
    ConfigModule,
    UsersModule
  ]
})
export class SeedModule { }
