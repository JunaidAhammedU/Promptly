# Global Error Handling Implementation

This directory contains a comprehensive, professional error handling system for the NestJS application.

## 📁 Structure

```
src/common/
├── exceptions/
│   └── http.exceptions.ts          # Custom exception classes
├── filters/
│   └── all-exceptions.filter.ts    # Global exception filter
├── interceptors/
│   ├── logging.interceptor.ts      # Request/response logging
│   └── transform.interceptor.ts    # Response transformation
└── interfaces/
    └── error-response.interface.ts # Error response types
```

## ✨ Features

### 1. **Custom Exception Classes**
- `BadRequestException` - 400 errors
- `UnauthorizedException` - 401 errors
- `ForbiddenException` - 403 errors
- `NotFoundException` - 404 errors
- `ConflictException` - 409 errors
- `ValidationException` - Validation errors
- `DatabaseException` - Database errors
- `RecordNotFoundException` - Record not found
- `DuplicateEntryException` - Duplicate entries
- `InternalServerException` - 500 errors

### 2. **Global Exception Filter**
- Catches ALL exceptions across the application
- Handles Prisma database errors automatically
- Provides consistent error response format
- Logs errors with Winston logger
- Sanitizes sensitive data (passwords, tokens, etc.)
- Environment-aware stack traces (only in development)

### 3. **Logging Interceptor**
- Logs all incoming requests
- Logs all outgoing responses
- Tracks response times
- Sanitizes sensitive fields
- Uses Winston logger

### 4. **Transform Interceptor**
- Wraps all successful responses in a consistent format
- Adds metadata (success status, timestamp, status code)

### 5. **Enhanced Validation**
- JoiValidationPipe now throws custom exceptions
- Detailed field-level error information
- Better error messages

## 🚀 Usage Examples

### Throwing Custom Exceptions

```typescript
import { 
  NotFoundException, 
  ConflictException,
  ValidationException 
} from '../common/exceptions/http.exceptions';

// Simple exception
throw new NotFoundException('User not found');

// Exception with details
throw new ConflictException('User already exists', [
  {
    field: 'email',
    message: 'Email is already registered',
    value: 'user@example.com'
  }
]);

// Validation exception
throw new ValidationException('Invalid input data', [
  { field: 'email', message: 'Email is required' },
  { field: 'age', message: 'Age must be greater than 18', value: 15 }
]);
```

### Error Response Format

**Success Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": 1,
    "name": "John Doe"
  },
  "timestamp": "2025-10-04T12:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 404,
  "errorCode": "NOT_FOUND",
  "message": "User not found",
  "details": [
    {
      "field": "id",
      "message": "User does not exist",
      "value": 123
    }
  ],
  "timestamp": "2025-10-04T12:00:00.000Z",
  "path": "/api/v1/users/123"
}
```

**Validation Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "errorCode": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "email must be a valid email",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "password is required"
    }
  ],
  "timestamp": "2025-10-04T12:00:00.000Z",
  "path": "/api/v1/users"
}
```

## 🔧 Configuration

### Environment Variables

The error handling system respects the following environment variables:

- `NODE_ENV`: Set to `production` to hide stack traces
- `LOG_LEVEL`: Set logging level (error, warn, info, debug)

### Prisma Error Handling

The system automatically handles common Prisma errors:

- `P2002`: Unique constraint violation → 409 Conflict
- `P2025`: Record not found → 404 Not Found
- `P2003`: Foreign key constraint violation → 400 Bad Request
- `P2014`: Required relation missing → 400 Bad Request

## 📝 Best Practices

1. **Always use custom exceptions** instead of generic HttpException
2. **Provide detailed error information** using the details array
3. **Use appropriate exception types** for different scenarios
4. **Don't expose sensitive information** in error messages
5. **Log errors properly** for debugging and monitoring

## 🔒 Security Features

- **Data Sanitization**: Automatically redacts sensitive fields (password, token, secret, apiKey)
- **Stack Traces**: Only shown in non-production environments
- **Request Logging**: Sanitizes sensitive data before logging

## 📊 Logging

All errors are logged with Winston:

- **Server Errors (5xx)**: Logged as `error` with full stack trace
- **Client Errors (4xx)**: Logged as `warn` with request details
- **Successful Requests**: Logged as `info` with response time

Logs are stored in:
- `logs/error.log` - Error level logs only
- `logs/combined.log` - All logs

## 🎯 Integration Points

The error handling is registered in two places:

1. **main.ts**: Using `app.useGlobalFilters()` and `app.useGlobalInterceptors()`
2. **app.module.ts**: Using `APP_FILTER` and `APP_INTERCEPTOR` providers

Both methods work, but using providers in `app.module.ts` allows for dependency injection.

## 📚 Additional Resources

- See `users.service.example.ts` for implementation examples
- Check the Winston logger configuration in `src/config/logger.ts`
- Review the Joi validation pipe in `src/config/joi-validation.pipe.ts`

## 🐛 Troubleshooting

If errors are not being caught:
1. Ensure the filter is registered globally
2. Check that exceptions extend from Error or HttpException
3. Verify the filter order in the interceptor chain
4. Check logs in `logs/` directory for details
