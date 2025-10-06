import { Optional } from "@nestjs/common";
import { IsArray, IsBoolean, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePromptDto {

    @IsString()
    @MinLength(3)
    @MaxLength(500)
    title: string;

    @IsString()
    @MinLength(10)
    @MaxLength(2500)
    content: string;

    @IsString()
    exampleOutput: string;

    @Optional()
    @IsString()
    category: string;

    @IsBoolean()
    isPublic: boolean;

    @IsString()
    autherId: string;

    @Optional()
    @IsString()
    auther: string;

    @Optional()
    @IsArray()
    @IsString({ each: true })
    @MinLength(1, { each: true })
    @MaxLength(15, { each: true })
    tags: string[];
}
