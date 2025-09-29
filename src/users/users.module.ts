import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Repository } from './repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, Repository],
})
export class UsersModule { }
