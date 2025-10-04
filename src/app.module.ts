import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PromptsModule } from './prompts/prompts.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, PromptsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }