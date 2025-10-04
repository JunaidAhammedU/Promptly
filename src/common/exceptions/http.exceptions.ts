import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorDetails } from '../interfaces/error-response.interface';

export class BaseHttpException extends HttpException {
    constructor(
        public readonly errorCode: ErrorCode,
        public readonly message: string,
        public readonly statusCode: HttpStatus,
        public readonly details?: ErrorDetails[],
    ) {
        super({ errorCode, message, details }, statusCode);
    }
}

export class BadRequestException extends BaseHttpException {
    constructor(message: string = 'Bad Request', details?: ErrorDetails[]) {
        super(ErrorCode.BAD_REQUEST, message, HttpStatus.BAD_REQUEST, details);
    }
}

export class UnauthorizedException extends BaseHttpException {
    constructor(message: string = 'Unauthorized', details?: ErrorDetails[]) {
        super(ErrorCode.UNAUTHORIZED, message, HttpStatus.UNAUTHORIZED, details);
    }
}

export class ForbiddenException extends BaseHttpException {
    constructor(message: string = 'Forbidden', details?: ErrorDetails[]) {
        super(ErrorCode.FORBIDDEN, message, HttpStatus.FORBIDDEN, details);
    }
}

export class NotFoundException extends BaseHttpException {
    constructor(message: string = 'Resource not found', details?: ErrorDetails[]) {
        super(ErrorCode.NOT_FOUND, message, HttpStatus.NOT_FOUND, details);
    }
}

export class ConflictException extends BaseHttpException {
    constructor(message: string = 'Conflict', details?: ErrorDetails[]) {
        super(ErrorCode.CONFLICT, message, HttpStatus.CONFLICT, details);
    }
}

export class ValidationException extends BaseHttpException {
    constructor(message: string = 'Validation failed', details?: ErrorDetails[]) {
        super(ErrorCode.VALIDATION_ERROR, message, HttpStatus.BAD_REQUEST, details);
    }
}

export class UnprocessableEntityException extends BaseHttpException {
    constructor(message: string = 'Unprocessable Entity', details?: ErrorDetails[]) {
        super(ErrorCode.UNPROCESSABLE_ENTITY, message, HttpStatus.UNPROCESSABLE_ENTITY, details);
    }
}

export class InternalServerException extends BaseHttpException {
    constructor(message: string = 'Internal Server Error', details?: ErrorDetails[]) {
        super(ErrorCode.INTERNAL_SERVER_ERROR, message, HttpStatus.INTERNAL_SERVER_ERROR, details);
    }
}

export class ServiceUnavailableException extends BaseHttpException {
    constructor(message: string = 'Service Unavailable', details?: ErrorDetails[]) {
        super(ErrorCode.SERVICE_UNAVAILABLE, message, HttpStatus.SERVICE_UNAVAILABLE, details);
    }
}

export class DatabaseException extends BaseHttpException {
    constructor(message: string = 'Database Error', details?: ErrorDetails[]) {
        super(ErrorCode.DATABASE_ERROR, message, HttpStatus.INTERNAL_SERVER_ERROR, details);
    }
}

export class RecordNotFoundException extends BaseHttpException {
    constructor(message: string = 'Record not found', details?: ErrorDetails[]) {
        super(ErrorCode.RECORD_NOT_FOUND, message, HttpStatus.NOT_FOUND, details);
    }
}

export class DuplicateEntryException extends BaseHttpException {
    constructor(message: string = 'Duplicate entry', details?: ErrorDetails[]) {
        super(ErrorCode.DUPLICATE_ENTRY, message, HttpStatus.CONFLICT, details);
    }
}

export class BusinessLogicException extends BaseHttpException {
    constructor(message: string = 'Business logic error', details?: ErrorDetails[]) {
        super(ErrorCode.BUSINESS_LOGIC_ERROR, message, HttpStatus.BAD_REQUEST, details);
    }
}
