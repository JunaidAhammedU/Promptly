import { Injectable } from '@nestjs/common';
import { IPrompt, IPromptResponse } from './interface/prompt.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PromptRepository {
    constructor(
        private prisma: PrismaService,
    ) { }

    async create(data: IPrompt): Promise<IPromptResponse> {
        const prompt = await this.prisma.prompt.create({
            data: {
                title: data.title,
                content: data.content,
                exampleOutput: data.exampleOutput,
                category: data.category,
                isPublic: data.isPublic,
                authorId: data.authorId,
                tags: {
                    create: data.tags.map(tag => ({
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
            title: prompt.title,
            content: prompt.content,
            exampleOutput: prompt.exampleOutput ?? '',
            category: prompt.category ?? '',
            isPublic: prompt.isPublic,
            author: prompt.author.name,
            tags: prompt.tags.map(pt => pt.tag.name),
            createdAt: prompt.createdAt,
            updatedAt: prompt.updatedAt
        };
    }
}
