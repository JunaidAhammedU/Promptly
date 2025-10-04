import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import logger from '../../config/logger';
import { ErrorCode, ErrorResponse } from '../interfaces/error-response.interface';
import { BaseHttpException } from '../exceptions/http.exceptions';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const errorResponse = this.buildErrorResponse(exception, request);

        // Log error
        this.logError(exception, request, errorResponse);

        // Send response
        response.status(errorResponse.statusCode).json(errorResponse);
    }

    private buildErrorResponse(exception: unknown, request: Request): ErrorResponse {
        const timestamp = new Date().toISOString();
        const path = request.url;

        // Handle custom BaseHttpException
        if (exception instanceof BaseHttpException) {
            return {
                success: false,
                statusCode: exception.statusCode,
                errorCode: exception.errorCode,
                message: exception.message,
                details: exception.details,
                timestamp,
                path,
                ...(process.env.NODE_ENV !== 'production' && {
                }),
            };
        }

        // Handle NestJS HttpException
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            const message = typeof exceptionResponse === 'string'
                ? exceptionResponse
                : (exceptionResponse as any).message || exception.message;

            return {
                success: false,
                statusCode: status,
                errorCode: this.getErrorCodeFromStatus(status),
                message: Array.isArray(message) ? message.join(', ') : message,
                timestamp,
                path,
                ...(process.env.NODE_ENV !== 'production' && {
                }),
            };
        }

        // Handle Prisma errors
        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            return this.handlePrismaError(exception, timestamp, path);
        }

        if (exception instanceof Prisma.PrismaClientValidationError) {
            return {
                success: false,
                statusCode: HttpStatus.BAD_REQUEST,
                errorCode: ErrorCode.VALIDATION_ERROR,
                message: 'Database validation error',
                details: [{ message: 'Invalid data provided to database' }],
                timestamp,
                path,
            };
        }

        // Handle unknown errors
        const isError = exception instanceof Error;
        return {
            success: false,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
            message: isError ? exception.message : 'Internal server error',
            timestamp,
            path,
            ...(process.env.NODE_ENV !== 'production' && isError && {
            }),
        };
    }

    private handlePrismaError(
        exception: Prisma.PrismaClientKnownRequestError,
        timestamp: string,
        path: string,
    ): ErrorResponse {
        switch (exception.code) {
            case 'P2002': // Unique constraint violation
                return {
                    success: false,
                    statusCode: HttpStatus.CONFLICT,
                    errorCode: ErrorCode.DUPLICATE_ENTRY,
                    message: 'A record with this value already exists',
                    details: [
                        {
                            message: `Duplicate entry for fields: ${(exception.meta?.target as string[])?.join(', ')}`,
                        },
                    ],
                    timestamp,
                    path,
                };

            case 'P2025': // Record not found
                return {
                    success: false,
                    statusCode: HttpStatus.NOT_FOUND,
                    errorCode: ErrorCode.RECORD_NOT_FOUND,
                    message: 'Record not found',
                    details: [{ message: exception.meta?.cause as string || 'The requested record does not exist' }],
                    timestamp,
                    path,
                };

            case 'P2003': // Foreign key constraint violation
                return {
                    success: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    errorCode: ErrorCode.BAD_REQUEST,
                    message: 'Invalid reference',
                    details: [{ message: 'The provided reference does not exist' }],
                    timestamp,
                    path,
                };

            case 'P2014': // Required relation violation
                return {
                    success: false,
                    statusCode: HttpStatus.BAD_REQUEST,
                    errorCode: ErrorCode.BAD_REQUEST,
                    message: 'Required relation missing',
                    details: [{ message: exception.message }],
                    timestamp,
                    path,
                };

            default:
                return {
                    success: false,
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    errorCode: ErrorCode.DATABASE_ERROR,
                    message: 'Database error occurred',
                    details: [{ message: exception.message }],
                    timestamp,
                    path,
                };
        }
    }

    private getErrorCodeFromStatus(status: number): ErrorCode {
        switch (status) {
            case HttpStatus.BAD_REQUEST:
                return ErrorCode.BAD_REQUEST;
            case HttpStatus.UNAUTHORIZED:
                return ErrorCode.UNAUTHORIZED;
            case HttpStatus.FORBIDDEN:
                return ErrorCode.FORBIDDEN;
            case HttpStatus.NOT_FOUND:
                return ErrorCode.NOT_FOUND;
            case HttpStatus.CONFLICT:
                return ErrorCode.CONFLICT;
            case HttpStatus.UNPROCESSABLE_ENTITY:
                return ErrorCode.UNPROCESSABLE_ENTITY;
            case HttpStatus.SERVICE_UNAVAILABLE:
                return ErrorCode.SERVICE_UNAVAILABLE;
            default:
                return ErrorCode.INTERNAL_SERVER_ERROR;
        }
    }

    private logError(exception: unknown, request: Request, errorResponse: ErrorResponse) {
        const { method, url, body, query, params, ip, headers } = request;
        const userAgent = headers['user-agent'] || 'Unknown';

        const logContext = {
            timestamp: errorResponse.timestamp,
            method,
            url,
            statusCode: errorResponse.statusCode,
            errorCode: errorResponse.errorCode,
            message: errorResponse.message,
            ip,
            userAgent,
            body: this.sanitizeData(body),
            query,
            params,
        };

        if (errorResponse.statusCode >= 500) {
            logger.error('Server error occurred', {
                ...logContext,
                error: exception instanceof Error ? {
                    name: exception.name,
                    message: exception.message,
                } : exception,
            });
        } else if (errorResponse.statusCode >= 400) {
            logger.warn('Client error occurred', logContext);
        }
    }

    private sanitizeData(data: any): any {
        if (!data) return data;

        const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'authorization'];
        const sanitized = { ...data };

        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '***REDACTED***';
            }
        });

        return sanitized;
    }
}
