import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
    NotFoundException,
    ConflictException,
    InternalServerException,
} from '../common/exceptions/http.exceptions';

/**
 * Example UsersService demonstrating how to use custom exceptions
 * This is a template showing best practices for error handling
 */
@Injectable()
export class UsersServiceExample {
    private users: any[] = []; // Replace with actual database calls

    async create(createUserDto: CreateUserDto) {
        try {
            // Check if user already exists
            const existingUser = this.users.find(
                (user) => user.email === createUserDto.email,
            );

            if (existingUser) {
                throw new ConflictException('User with this email already exists', [
                    {
                        field: 'email',
                        message: 'Email is already registered',
                        value: createUserDto.email,
                    },
                ]);
            }

            // Create user logic here
            const newUser = {
                id: this.users.length + 1,
                ...createUserDto,
                createdAt: new Date(),
            };

            this.users.push(newUser);
            return newUser;
        } catch (error) {
            // If it's already our custom exception, just throw it
            if (error.name === 'BaseHttpException' || error.statusCode) {
                throw error;
            }

            // Otherwise, wrap it in an InternalServerException
            throw new InternalServerException('Failed to create user', [
                { message: error.message },
            ]);
        }
    }

    async findAll() {
        try {
            return this.users;
        } catch (error) {
            throw new InternalServerException('Failed to fetch users');
        }
    }

    async findOne(id: number) {
        const user = this.users.find((u) => u.id === id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`, [
                {
                    field: 'id',
                    message: 'User does not exist',
                    value: id,
                },
            ]);
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.findOne(id); // This will throw NotFoundException if not found

        try {
            Object.assign(user, updateUserDto);
            return user;
        } catch (error) {
            if (error.name === 'BaseHttpException' || error.statusCode) {
                throw error;
            }
            throw new InternalServerException('Failed to update user');
        }
    }

    async remove(id: number) {
        const userIndex = this.users.findIndex((u) => u.id === id);

        if (userIndex === -1) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        this.users.splice(userIndex, 1);
        return { message: 'User deleted successfully' };
    }
}
