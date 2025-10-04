import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import {
    NotFoundException,
    BadRequestException,
    ConflictException,
    ValidationException,
} from '../exceptions/http.exceptions';

/**
 * Test controller to demonstrate error handling
 * Access via: http://localhost:3000/api/v1/error-test/*
 */
@Controller('error-test')
export class ErrorTestController {
    @Get('success')
    testSuccess() {
        return {
            message: 'This is a successful response',
            data: { test: true },
        };
    }

    @Get('not-found')
    testNotFound() {
        throw new NotFoundException('Test resource not found', [
            {
                field: 'id',
                message: 'Resource does not exist',
                value: 123,
            },
        ]);
    }

    @Get('bad-request')
    testBadRequest() {
        throw new BadRequestException('Invalid request parameters', [
            {
                field: 'limit',
                message: 'Limit must be between 1 and 100',
                value: 200,
            },
        ]);
    }

    @Get('conflict')
    testConflict() {
        throw new ConflictException('Resource already exists', [
            {
                field: 'email',
                message: 'This email is already registered',
                value: 'test@example.com',
            },
        ]);
    }

    @Get('validation')
    testValidation() {
        throw new ValidationException('Validation failed', [
            {
                field: 'email',
                message: 'Email must be a valid email address',
                value: 'invalid-email',
            },
            {
                field: 'password',
                message: 'Password must be at least 8 characters',
                value: '123',
            },
        ]);
    }

    @Get('server-error')
    testServerError() {
        // Simulate an unexpected error
        throw new Error('Unexpected server error occurred');
    }

    @Get('divide-by-zero')
    testUnexpectedError() {
        // This will cause a runtime error
        const result = 10 / 0;
        if (!isFinite(result)) {
            throw new Error('Cannot divide by zero');
        }
        return result;
    }

    @Post('test-validation')
    testPostValidation(@Body() body: any) {
        if (!body.email) {
            throw new ValidationException('Email is required', [
                {
                    field: 'email',
                    message: 'Email field cannot be empty',
                },
            ]);
        }
        return { message: 'Validation passed', email: body.email };
    }

    @Get('user/:id')
    testDynamicNotFound(@Param('id') id: string) {
        const userId = parseInt(id);
        if (userId > 100) {
            throw new NotFoundException(`User with ID ${userId} not found`, [
                {
                    field: 'id',
                    message: 'User ID is out of range',
                    value: userId,
                },
            ]);
        }
        return { id: userId, name: 'Test User' };
    }
}
