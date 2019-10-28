import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DBModule } from '../db/db.module';
import { userProviders } from './user.providers';

@Module({
  imports: [DBModule],
  providers: [...userProviders, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
