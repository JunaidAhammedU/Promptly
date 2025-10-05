import { IsString, IsEmail, MinLength, MaxLength, IsOptional, IsIn, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(12)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}\-_=+|;:'",.<>/?`~]).+$/, {
        message: 'password must include uppercase, lowercase, numeric, and special characters',
    })
    password: string;

    @IsOptional()
    @IsString()
    @IsIn(['USER', 'ADMIN'], { message: 'Role must be either USER or ADMIN' })
    role?: string = 'USER';
}