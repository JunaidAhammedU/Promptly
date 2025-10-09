import { Injectable } from '@nestjs/common';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { PromptRepository } from './repository';

@Injectable()
export class PromptsService {
  constructor(private promptRepository: PromptRepository) { }
  create(createPromptDto: CreatePromptDto) {
    return this.promptRepository.create(createPromptDto);
  }

  findAll() {
    return this.promptRepository.getAll();
  }

  findOne(id: string) {
    return this.promptRepository.getById(id);
  }

  update(id: string, updatePromptDto: UpdatePromptDto) {
    const exists = this.promptRepository.exists(id);
    if (!exists) {
      throw new Error('Prompt not found');
    }
    return this.promptRepository.update(id, updatePromptDto);
  }

  remove(id: string) {
    const exists = this.promptRepository.exists(id);
    if (!exists) {
      throw new Error('Prompt not found');
    }
    return this.promptRepository.remove(id);
  }
}
