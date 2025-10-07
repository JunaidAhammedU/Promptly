import { Module } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { PromptsController } from './prompts.controller';
import { PromptRepository } from './repository';

@Module({
  controllers: [PromptsController],
  providers: [PromptsService, PromptRepository],
})
export class PromptsModule { }
