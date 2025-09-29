import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PromptsModule } from './prompts/prompts.module';

@Module({
  imports: [UsersModule, AuthModule, PromptsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

