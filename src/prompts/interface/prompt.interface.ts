// need to add respective interface for user
export interface IPrompt {
    title: string;
    content: string;
    exampleOutput: string;
    category: string;
    isPublic: boolean;
    autherId: string;
    auther: string;
    tags: string[];
}

export interface IPromptResponse {
    id: string;
    title: string;
    content: string;
    exampleOutput: string;
    category: string;
    isPublic: boolean;
    autherId: string;
    auther: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IPromptUpdate {
    id: string;
    title?: string;
    content?: string;
    exampleOutput?: string;
    category?: string;
    isPublic?: boolean;
    autherId?: string;
    auther?: string;
    tags?: string[];
}