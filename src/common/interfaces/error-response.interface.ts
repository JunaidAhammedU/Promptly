export enum ErrorCode {
    // Client Errors (4xx)
    BAD_REQUEST = 'BAD_REQUEST',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    CONFLICT = 'CONFLICT',
    UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
    VALIDATION_ERROR = 'VALIDATION_ERROR',

    // Server Errors (5xx)
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

    // Database Errors
    DATABASE_ERROR = 'DATABASE_ERROR',
    RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
    DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',

    // Business Logic Errors
    BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR',
    OPERATION_FAILED = 'OPERATION_FAILED',
}

export interface ErrorDetails {
    field?: string;
    message: string;
    value?: any;
}

export interface ErrorResponse {
    success: boolean;
    statusCode: number;
    errorCode: ErrorCode;
    message: string;
    details?: ErrorDetails[];
    timestamp: string;
    path: string;
    stack?: string;
}
