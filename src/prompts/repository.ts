import { Injectable } from '@nestjs/common';
import { IPrompt, IPromptResponse } from './interface/prompt.interface';

@Injectable()
export class PromptRepository {
    constructor() { }

    async create(entity: IPrompt): Promise<IPromptResponse> {
        console.log(entity);
        return { ...entity, id: 'some-unique-id', createdAt: new Date(), updatedAt: new Date() };
    }
}
