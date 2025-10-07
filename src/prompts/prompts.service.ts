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
    return `This action returns all prompts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prompt`;
  }

  update(id: number, updatePromptDto: UpdatePromptDto) {
    return `This action updates a #${id} prompt`;
  }

  remove(id: number) {
    return `This action removes a #${id} prompt`;
  }
}
