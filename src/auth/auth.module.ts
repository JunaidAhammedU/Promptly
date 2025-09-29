import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Repository } from './repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, Repository],
})
export class AuthModule { }
