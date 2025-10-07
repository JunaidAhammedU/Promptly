import { Injectable } from '@nestjs/common';
import { IPrompt, IPromptResponse } from './interface/prompt.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PromptRepository {
    constructor(
        private prisma: PrismaService,
    ) { }

    async create(entity: IPrompt): Promise<IPromptResponse> {
        const prompt = await this.prisma.prompt.create({
            data: {
                title: entity.title,
                content: entity.content,
                exampleOutput: entity.exampleOutput,
                category: entity.category,
                isPublic: entity.isPublic,
                authorId: entity.authorId,
                tags: {
                    create: entity.tags.map(tag => ({
                        tag: {
                            connectOrCreate: {
                                where: { name: tag },
                                create: { name: tag }
                            }
                        }
                    })),
                },
            },
            include: {
                author: true,
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        });

        return {
            id: prompt.id,
            title: prompt.title,
            content: prompt.content,
            exampleOutput: prompt.exampleOutput ?? '',
            category: prompt.category ?? '',
            isPublic: prompt.isPublic,
            authorId: prompt.authorId,
            author: prompt.author.name,
            tags: prompt.tags.map(pt => pt.tag.name),
            createdAt: prompt.createdAt,
            updatedAt: prompt.updatedAt
        };
    }
}
