import { Injectable } from '@nestjs/common';
import { IPrompt, IPromptResponse } from './interface/prompt.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PromptRepository {
    constructor(
        private prisma: PrismaService,
    ) { }

    // check prompt excists by id.
    async exists(id: string): Promise<boolean> {
        const count = await this.prisma.prompt.count({
            where: { id }
        });
        return count > 0;
    }

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

    async getById(id: string): Promise<IPromptResponse | null> {
        const prompt = await this.prisma.prompt.findUnique({
            where: { id },
            include: {
                author: true,
                tags: {
                    include: {
                        tag: true
                    }
                }
            },
        });

        if (!prompt) return null;

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

    async getAll(page: number = 1, limit: number = 10): Promise<{ data: IPromptResponse[], total: number, page: number, limit: number }> {
        const skip = (page - 1) * limit;

        const [prompts, total] = await Promise.all([
            this.prisma.prompt.findMany({
                skip,
                take: limit,
                include: {
                    author: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.prompt.count()
        ]);

        return {
            data: prompts.map(prompt => ({
                title: prompt.title,
                content: prompt.content,
                exampleOutput: prompt.exampleOutput ?? '',
                category: prompt.category ?? '',
                isPublic: prompt.isPublic,
                author: prompt.author.name,
                tags: prompt.tags.map(pt => pt.tag.name),
                createdAt: prompt.createdAt,
                updatedAt: prompt.updatedAt
            })),
            total,
            page,
            limit
        };
    }

    async update(id: string, data: Partial<IPrompt>): Promise<IPromptResponse | null> {
        const prompt = await this.prisma.prompt.update(
            {
                where: { id: id },
                data: {
                    ...data,
                    tags: data.tags ? {
                        deleteMany: {},
                        create: data.tags.map(tag => ({
                            tag: {
                                connectOrCreate: {
                                    where: { name: tag },
                                    create: { name: tag }
                                }
                            }
                        })),
                    } : undefined
                }
            });

        if (!prompt) return null;

        return {
            title: prompt.title,
            content: prompt.content,
            exampleOutput: prompt.exampleOutput ?? '',
            category: prompt.category ?? '',
            isPublic: prompt.isPublic,
            author: data.authorId ?? '',
            tags: data.tags ?? [],
            createdAt: prompt.createdAt,
            updatedAt: prompt.updatedAt
        };
    }
}
