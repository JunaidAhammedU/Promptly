import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repository';
import { CryptoHelper } from 'src/common/helper/crypto.helper';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, CryptoHelper],
})
export class UsersModule { }
