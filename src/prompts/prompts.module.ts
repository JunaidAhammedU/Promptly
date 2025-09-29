import { Module } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { PromptsController } from './prompts.controller';
import { Repository } from './repository';

@Module({
  controllers: [PromptsController],
  providers: [PromptsService, Repository],
})
export class PromptsModule { }
